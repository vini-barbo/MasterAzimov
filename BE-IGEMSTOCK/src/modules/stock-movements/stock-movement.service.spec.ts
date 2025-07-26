import { Test, TestingModule } from '@nestjs/testing';
import { StockMovementService } from './stock-movement.service';
import { PrismaService } from '../../database/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateStockMovementDto } from './dto';

describe('StockMovementService', () => {
  let service: StockMovementService;
  let prisma: PrismaService;

  const mockPrismaService = {
    stockMovement: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
    },
    warehouse: {
      findUnique: jest.fn(),
    },
    batch: {
      findUnique: jest.fn(),
    },
  };

  const mockStockMovement = {
    id: 1,
    productId: 1,
    warehouseId: 1,
    batchId: 1,
    movementType: 'IN',
    quantity: 100,
    unitPrice: 10.0,
    totalValue: 1000.0,
    reason: 'Initial stock',
    reference: 'REF-001',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateStockMovementDto: CreateStockMovementDto = {
    productId: 1,
    warehouseId: 1,
    batchId: 1,
    movementType: 'IN',
    quantity: 100,
    unitPrice: 10.0,
    reason: 'Initial stock',
    reference: 'REF-001',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockMovementService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<StockMovementService>(StockMovementService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a stock movement', async () => {
      const totalValue = 100 * 10.0; // quantity * unitPrice
      const expectedMovement = {
        ...mockStockMovement,
        totalValue,
      };

      mockPrismaService.stockMovement.create.mockResolvedValue(
        expectedMovement,
      );

      const result = await service.create(mockCreateStockMovementDto);

      expect(prisma.stockMovement.create).toHaveBeenCalledWith({
        data: {
          ...mockCreateStockMovementDto,
          totalValue,
        },
        include: {
          product: true,
          warehouse: true,
          batch: true,
        },
      });
      expect(result).toEqual(expectedMovement);
    });

    it('should handle movements without unit price', async () => {
      const dtoWithoutPrice = {
        ...mockCreateStockMovementDto,
        unitPrice: undefined,
      };
      const expectedMovement = {
        ...mockStockMovement,
        unitPrice: null,
        totalValue: 0,
      };

      mockPrismaService.stockMovement.create.mockResolvedValue(
        expectedMovement,
      );

      const result = await service.create(dtoWithoutPrice);

      expect(prisma.stockMovement.create).toHaveBeenCalledWith({
        data: {
          ...dtoWithoutPrice,
          totalValue: 0,
        },
        include: {
          product: true,
          warehouse: true,
          batch: true,
        },
      });
      expect(result).toEqual(expectedMovement);
    });
  });

  describe('findAll', () => {
    it('should return all stock movements', async () => {
      const mockMovements = [mockStockMovement];
      mockPrismaService.stockMovement.findMany.mockResolvedValue(mockMovements);

      const result = await service.findAll();

      expect(prisma.stockMovement.findMany).toHaveBeenCalledWith({
        include: {
          product: true,
          warehouse: true,
          batch: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockMovements);
    });

    it('should filter by product', async () => {
      const mockMovements = [mockStockMovement];
      mockPrismaService.stockMovement.findMany.mockResolvedValue(mockMovements);

      const result = await service.findAll(1);

      expect(prisma.stockMovement.findMany).toHaveBeenCalledWith({
        where: { productId: 1 },
        include: {
          product: true,
          warehouse: true,
          batch: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockMovements);
    });

    it('should filter by warehouse', async () => {
      const mockMovements = [mockStockMovement];
      mockPrismaService.stockMovement.findMany.mockResolvedValue(mockMovements);

      const result = await service.findAll(undefined, 1);

      expect(prisma.stockMovement.findMany).toHaveBeenCalledWith({
        where: { warehouseId: 1 },
        include: {
          product: true,
          warehouse: true,
          batch: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockMovements);
    });

    it('should filter by movement type', async () => {
      const mockMovements = [mockStockMovement];
      mockPrismaService.stockMovement.findMany.mockResolvedValue(mockMovements);

      const result = await service.findAll(undefined, undefined, 'IN');

      expect(prisma.stockMovement.findMany).toHaveBeenCalledWith({
        where: { movementType: 'IN' },
        include: {
          product: true,
          warehouse: true,
          batch: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockMovements);
    });

    it('should filter by multiple criteria', async () => {
      const mockMovements = [mockStockMovement];
      mockPrismaService.stockMovement.findMany.mockResolvedValue(mockMovements);

      const result = await service.findAll(1, 1, 'IN');

      expect(prisma.stockMovement.findMany).toHaveBeenCalledWith({
        where: {
          productId: 1,
          warehouseId: 1,
          movementType: 'IN',
        },
        include: {
          product: true,
          warehouse: true,
          batch: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockMovements);
    });
  });

  describe('findOne', () => {
    it('should return a stock movement by id', async () => {
      const mockMovementWithRelations = {
        ...mockStockMovement,
        product: { id: 1, name: 'Product 1' },
        warehouse: { id: 1, name: 'Warehouse 1' },
        batch: { id: 1, batchNumber: 'BATCH001' },
      };

      mockPrismaService.stockMovement.findUnique.mockResolvedValue(
        mockMovementWithRelations,
      );

      const result = await service.findOne(1);

      expect(prisma.stockMovement.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          product: true,
          warehouse: true,
          batch: true,
        },
      });
      expect(result).toEqual(mockMovementWithRelations);
    });

    it('should throw NotFoundException when movement not found', async () => {
      mockPrismaService.stockMovement.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Stock movement with ID 999 not found'),
      );
    });
  });

  describe('getMovementsByDateRange', () => {
    it('should return movements within date range', async () => {
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-12-31');
      const mockMovements = [mockStockMovement];

      mockPrismaService.stockMovement.findMany.mockResolvedValue(mockMovements);

      const result = await service.getMovementsByDateRange(startDate, endDate);

      expect(prisma.stockMovement.findMany).toHaveBeenCalledWith({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          product: true,
          warehouse: true,
          batch: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockMovements);
    });

    it('should filter by product within date range', async () => {
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-12-31');
      const mockMovements = [mockStockMovement];

      mockPrismaService.stockMovement.findMany.mockResolvedValue(mockMovements);

      const result = await service.getMovementsByDateRange(
        startDate,
        endDate,
        1,
      );

      expect(prisma.stockMovement.findMany).toHaveBeenCalledWith({
        where: {
          productId: 1,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          product: true,
          warehouse: true,
          batch: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockMovements);
    });
  });
});
