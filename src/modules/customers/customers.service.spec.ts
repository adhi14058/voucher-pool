import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { PrismaService, Prisma } from '../database/prisma.service';

describe('CustomersService', () => {
  let service: CustomersService;

  const mockPrisma = {
    customer: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a customer successfully', async () => {
      const dto = { name: 'John Doe', email: 'john@example.com' };
      const expected = {
        id: 'uuid-1',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrisma.customer.create.mockResolvedValue(expected);

      const result = await service.create(dto);

      expect(result).toEqual(expected);
      expect(mockPrisma.customer.create).toHaveBeenCalledWith({ data: dto });
    });

    it('should throw ConflictException when email already exists', async () => {
      const dto = { name: 'John Doe', email: 'john@example.com' };
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed',
        { code: 'P2002', clientVersion: '7.0.0' },
      );
      mockPrisma.customer.create.mockRejectedValue(prismaError);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return a list of customers', async () => {
      const customers = [
        {
          id: 'uuid-1',
          name: 'John',
          email: 'john@example.com',
          createdAt: new Date(),
        },
        {
          id: 'uuid-2',
          name: 'Jane',
          email: 'jane@example.com',
          createdAt: new Date(),
        },
      ];
      mockPrisma.customer.findMany.mockResolvedValue(customers);

      const result = await service.findAll();

      expect(result).toEqual(customers);
      expect(mockPrisma.customer.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return an empty array when no customers exist', async () => {
      mockPrisma.customer.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });
});
