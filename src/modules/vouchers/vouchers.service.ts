import { randomBytes } from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { GenerateVoucherDto } from './dto/generate-voucher.dto';
import { RedeemVoucherDto } from './dto/redeem-voucher.dto';
import {
  RedeemVoucherResponseDto,
  ValidVoucherResponseDto,
  VoucherResponseDto,
} from './dto/voucher-response.dto';
import { AppLogger } from '../../core/logging/app-logger';

const MAX_CODE_ATTEMPTS = 10;

@Injectable()
export class VouchersService {
  private readonly logger = new AppLogger(VouchersService.name);

  constructor(private readonly prisma: PrismaService) {}

  generateCode(length = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return Array.from(randomBytes(length), (b) => chars[b % chars.length]).join(''); //prettier-ignore
  }

  async generate(dto: GenerateVoucherDto): Promise<VoucherResponseDto[]> {
    const specialOffer = await this.prisma.specialOffer.findUnique({
      where: { id: dto.specialOfferId },
    });

    if (!specialOffer) {
      throw new NotFoundException(
        `Special offer with id ${dto.specialOfferId} not found`,
      );
    }

    const expirationDate = new Date(dto.expirationDate);
    if (expirationDate <= new Date()) {
      throw new BadRequestException('Expiration date must be in the future');
    }

    return this.prisma.$transaction(async (tx) => {
      const customers = await tx.customer.findMany();
      if (customers.length === 0) {
        throw new BadRequestException(
          'No customers found to generate vouchers for',
        );
      }

      const created: VoucherResponseDto[] = [];

      for (const customer of customers) {
        const existing = await tx.voucherCode.findUnique({
          where: {
            customerId_specialOfferId: {
              customerId: customer.id,
              specialOfferId: dto.specialOfferId,
            },
          },
        });

        if (existing) {
          continue;
        }

        let code: string | undefined;
        for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
          const candidate = this.generateCode();
          const duplicate = await tx.voucherCode.findUnique({
            where: { code: candidate },
          });
          if (!duplicate) {
            code = candidate;
            break;
          }
        }

        if (!code) {
          this.logger.error(
            `Failed to generate unique voucher code after ${String(MAX_CODE_ATTEMPTS)} attempts for customer ${customer.id}`,
          );
          throw new InternalServerErrorException(
            'Failed to generate unique voucher code',
          );
        }

        const voucher = await tx.voucherCode.create({
          data: {
            code,
            expirationDate,
            customerId: customer.id,
            specialOfferId: dto.specialOfferId,
          },
        });

        created.push(voucher);
      }

      return created;
    });
  }

  async redeem(dto: RedeemVoucherDto): Promise<RedeemVoucherResponseDto> {
    return this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT * FROM voucher_codes WHERE code = ${dto.code} FOR UPDATE`;
      const voucher = await tx.voucherCode.findUnique({
        where: { code: dto.code },
        include: {
          customer: true,
          specialOffer: true,
        },
      });

      if (!voucher) {
        throw new NotFoundException('Voucher code not found');
      }

      if (voucher.customer.email.toLowerCase() !== dto.email.toLowerCase()) {
        throw new BadRequestException(
          'Voucher code does not belong to this email',
        );
      }

      if (voucher.usedAt) {
        throw new BadRequestException('Voucher code has already been used');
      }

      if (voucher.expirationDate < new Date()) {
        throw new BadRequestException('Voucher code has expired');
      }

      // Atomic conditional update to prevent race conditions
      const updated = await tx.voucherCode.updateMany({
        where: { id: voucher.id, usedAt: null },
        data: { usedAt: new Date() },
      });

      if (updated.count === 0) {
        throw new BadRequestException('Voucher code has already been used');
      }

      return { discountPercentage: voucher.specialOffer.discountPercentage };
    });
  }

  async findValidByEmail(email: string): Promise<ValidVoucherResponseDto[]> {
    const customer = await this.prisma.customer.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with email ${email} not found`);
    }

    const vouchers = await this.prisma.voucherCode.findMany({
      where: {
        customerId: customer.id,
        usedAt: null,
        expirationDate: { gt: new Date() },
      },
      include: {
        specialOffer: true,
      },
      orderBy: { expirationDate: 'asc' },
    });

    return vouchers.map((v) => ({
      code: v.code,
      specialOfferName: v.specialOffer.name,
      discountPercentage: v.specialOffer.discountPercentage,
      expirationDate: v.expirationDate,
    }));
  }
}
