import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService, Prisma } from '../database/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    try {
      return await this.prisma.customer.create({ data: dto });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Customer with this email already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<CustomerResponseDto[]> {
    return this.prisma.customer.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
