import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateSpecialOfferDto } from './dto/create-special-offer.dto';
import { SpecialOfferResponseDto } from './dto/special-offer-response.dto';

@Injectable()
export class SpecialOffersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSpecialOfferDto): Promise<SpecialOfferResponseDto> {
    return this.prisma.specialOffer.create({ data: dto });
  }

  async findAll(): Promise<SpecialOfferResponseDto[]> {
    return this.prisma.specialOffer.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
