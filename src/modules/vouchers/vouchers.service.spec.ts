/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { PrismaService } from '../database/prisma.service';

describe('VouchersService', () => {
  let service: VouchersService;

  const mockPrisma = {
    specialOffer: {
      findUnique: jest.fn(),
    },
    customer: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    voucherCode: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    $transaction: jest.fn((fn) => fn(mockPrisma)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VouchersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<VouchersService>(VouchersService);
    jest.clearAllMocks();
  });

  describe('generateCode', () => {
    it('should return a string of 8 characters by default', () => {
      const code = service.generateCode();
      expect(code).toHaveLength(8);
    });

    it('should return only alphanumeric characters', () => {
      const code = service.generateCode();
      expect(code).toMatch(/^[A-Za-z0-9]+$/);
    });

    it('should respect custom length parameter', () => {
      const code = service.generateCode(12);
      expect(code).toHaveLength(12);
    });
  });

  describe('generate', () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString();

    it('should throw NotFoundException when special offer not found', async () => {
      mockPrisma.specialOffer.findUnique.mockResolvedValue(null);

      await expect(
        service.generate({
          specialOfferId: 'nonexistent',
          expirationDate: futureDate,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when expiration date is in the past', async () => {
      mockPrisma.specialOffer.findUnique.mockResolvedValue({
        id: 'offer-1',
        name: 'Sale',
        discountPercentage: 10,
      });

      await expect(
        service.generate({
          specialOfferId: 'offer-1',
          expirationDate: '2020-01-01T00:00:00.000Z',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when no customers exist', async () => {
      mockPrisma.specialOffer.findUnique.mockResolvedValue({
        id: 'offer-1',
        name: 'Sale',
        discountPercentage: 10,
      });
      mockPrisma.customer.findMany.mockResolvedValue([]);

      await expect(
        service.generate({
          specialOfferId: 'offer-1',
          expirationDate: futureDate,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create vouchers for all customers', async () => {
      mockPrisma.specialOffer.findUnique.mockResolvedValue({
        id: 'offer-1',
        name: 'Sale',
        discountPercentage: 10,
      });
      mockPrisma.customer.findMany.mockResolvedValue([
        { id: 'cust-1', name: 'John', email: 'john@example.com' },
        { id: 'cust-2', name: 'Jane', email: 'jane@example.com' },
      ]);
      mockPrisma.voucherCode.findUnique.mockResolvedValue(null);
      mockPrisma.voucherCode.create.mockImplementation(({ data }) => ({
        id: `voucher-${data.customerId}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const result = await service.generate({
        specialOfferId: 'offer-1',
        expirationDate: futureDate,
      });

      expect(result).toHaveLength(2);
      expect(mockPrisma.$transaction).toHaveBeenCalled();
      expect(mockPrisma.voucherCode.create).toHaveBeenCalledTimes(2);
    });

    it('should skip customers who already have a voucher for the offer', async () => {
      mockPrisma.specialOffer.findUnique.mockResolvedValue({
        id: 'offer-1',
        name: 'Sale',
        discountPercentage: 10,
      });
      mockPrisma.customer.findMany.mockResolvedValue([
        { id: 'cust-1', name: 'John', email: 'john@example.com' },
        { id: 'cust-2', name: 'Jane', email: 'jane@example.com' },
      ]);

      mockPrisma.voucherCode.findUnique.mockImplementation((args) => {
        if (args.where?.customerId_specialOfferId?.customerId === 'cust-1') {
          return { id: 'existing-voucher' };
        }
        return null;
      });

      mockPrisma.voucherCode.create.mockImplementation(({ data }) => ({
        id: `voucher-${data.customerId}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const result = await service.generate({
        specialOfferId: 'offer-1',
        expirationDate: futureDate,
      });

      expect(result).toHaveLength(1);
      expect(mockPrisma.voucherCode.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('redeem', () => {
    it('should throw NotFoundException when voucher code not found', async () => {
      mockPrisma.voucherCode.findUnique.mockResolvedValue(null);

      await expect(
        service.redeem({ code: 'INVALID', email: 'john@example.com' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when email does not match', async () => {
      mockPrisma.voucherCode.findUnique.mockResolvedValue({
        id: 'voucher-1',
        code: 'ABCD1234',
        usedAt: null,
        expirationDate: new Date(Date.now() + 86400000),
        customer: { email: 'other@example.com' },
        specialOffer: { discountPercentage: 20 },
      });

      await expect(
        service.redeem({ code: 'ABCD1234', email: 'john@example.com' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when voucher already used', async () => {
      mockPrisma.voucherCode.findUnique.mockResolvedValue({
        id: 'voucher-1',
        code: 'ABCD1234',
        usedAt: new Date(),
        expirationDate: new Date(Date.now() + 86400000),
        customer: { email: 'john@example.com' },
        specialOffer: { discountPercentage: 20 },
      });

      await expect(
        service.redeem({ code: 'ABCD1234', email: 'john@example.com' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when voucher is expired', async () => {
      mockPrisma.voucherCode.findUnique.mockResolvedValue({
        id: 'voucher-1',
        code: 'ABCD1234',
        usedAt: null,
        expirationDate: new Date('2020-01-01'),
        customer: { email: 'john@example.com' },
        specialOffer: { discountPercentage: 20 },
      });

      await expect(
        service.redeem({ code: 'ABCD1234', email: 'john@example.com' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should successfully redeem a valid voucher and return discount', async () => {
      mockPrisma.voucherCode.findUnique.mockResolvedValue({
        id: 'voucher-1',
        code: 'ABCD1234',
        usedAt: null,
        expirationDate: new Date(Date.now() + 86400000),
        customer: { email: 'john@example.com' },
        specialOffer: { discountPercentage: 25 },
      });
      mockPrisma.voucherCode.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.redeem({
        code: 'ABCD1234',
        email: 'john@example.com',
      });

      expect(result).toEqual({ discountPercentage: 25 });
      expect(mockPrisma.voucherCode.updateMany).toHaveBeenCalledWith({
        where: { id: 'voucher-1', usedAt: null },
        data: { usedAt: expect.any(Date) },
      });
    });

    it('should throw BadRequestException when atomic update finds voucher already redeemed', async () => {
      mockPrisma.voucherCode.findUnique.mockResolvedValue({
        id: 'voucher-1',
        code: 'ABCD1234',
        usedAt: null,
        expirationDate: new Date(Date.now() + 86400000),
        customer: { email: 'john@example.com' },
        specialOffer: { discountPercentage: 25 },
      });
      mockPrisma.voucherCode.updateMany.mockResolvedValue({ count: 0 });

      await expect(
        service.redeem({ code: 'ABCD1234', email: 'john@example.com' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should compare emails case-insensitively', async () => {
      mockPrisma.voucherCode.findUnique.mockResolvedValue({
        id: 'voucher-1',
        code: 'ABCD1234',
        usedAt: null,
        expirationDate: new Date(Date.now() + 86400000),
        customer: { email: 'John@Example.com' },
        specialOffer: { discountPercentage: 25 },
      });
      mockPrisma.voucherCode.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.redeem({
        code: 'ABCD1234',
        email: 'john@example.com',
      });

      expect(result).toEqual({ discountPercentage: 25 });
    });
  });

  describe('findValidByEmail', () => {
    it('should throw NotFoundException when customer not found', async () => {
      mockPrisma.customer.findUnique.mockResolvedValue(null);

      await expect(
        service.findValidByEmail('nonexistent@example.com'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return only valid (unused, unexpired) vouchers', async () => {
      mockPrisma.customer.findUnique.mockResolvedValue({
        id: 'cust-1',
        email: 'john@example.com',
      });
      mockPrisma.voucherCode.findMany.mockResolvedValue([
        {
          code: 'CODE1234',
          expirationDate: new Date(Date.now() + 86400000),
          specialOffer: { name: 'Summer Sale', discountPercentage: 20 },
        },
      ]);

      const result = await service.findValidByEmail('john@example.com');

      expect(result).toEqual([
        {
          code: 'CODE1234',
          specialOfferName: 'Summer Sale',
          discountPercentage: 20,
          expirationDate: expect.any(Date),
        },
      ]);
      expect(mockPrisma.voucherCode.findMany).toHaveBeenCalledWith({
        where: {
          customerId: 'cust-1',
          usedAt: null,
          expirationDate: { gt: expect.any(Date) },
        },
        include: { specialOffer: true },
        orderBy: { expirationDate: 'asc' },
      });
    });

    it('should return empty array when all vouchers are used or expired', async () => {
      mockPrisma.customer.findUnique.mockResolvedValue({
        id: 'cust-1',
        email: 'john@example.com',
      });
      mockPrisma.voucherCode.findMany.mockResolvedValue([]);

      const result = await service.findValidByEmail('john@example.com');

      expect(result).toEqual([]);
    });
  });
});
