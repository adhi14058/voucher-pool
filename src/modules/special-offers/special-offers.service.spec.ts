import { Test, TestingModule } from '@nestjs/testing';
import { SpecialOffersService } from './special-offers.service';
import { PrismaService } from '../database/prisma.service';

describe('SpecialOffersService', () => {
  let service: SpecialOffersService;

  const mockPrisma = {
    specialOffer: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpecialOffersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<SpecialOffersService>(SpecialOffersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a special offer successfully', async () => {
      const dto = { name: 'Summer Sale', discountPercentage: 20 };
      const expected = {
        id: 'uuid-1',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrisma.specialOffer.create.mockResolvedValue(expected);

      const result = await service.create(dto);

      expect(result).toEqual(expected);
      expect(mockPrisma.specialOffer.create).toHaveBeenCalledWith({
        data: dto,
      });
    });
  });

  describe('findAll', () => {
    it('should return a list of special offers', async () => {
      const offers = [
        {
          id: 'uuid-1',
          name: 'Summer Sale',
          discountPercentage: 20,
          createdAt: new Date(),
        },
      ];
      mockPrisma.specialOffer.findMany.mockResolvedValue(offers);

      const result = await service.findAll();

      expect(result).toEqual(offers);
      expect(mockPrisma.specialOffer.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return an empty array when no offers exist', async () => {
      mockPrisma.specialOffer.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });
});
