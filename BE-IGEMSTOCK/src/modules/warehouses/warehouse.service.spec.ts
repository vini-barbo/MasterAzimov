import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseService } from './warehouse.service';
import { PrismaService } from '../../database/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateWarehouseDto, UpdateWarehouseDto } from './dto';

describe('WarehouseService', () => {
  let service: WarehouseService;
  let prisma: PrismaService;

  const mockPrismaService = {
    warehouse: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    stockMovement: {
      findMany: jest.fn(),
    },
  };

  const mockWarehouse = {
    id: 1,
    name: 'Main Warehouse',
    code: 'WH001',
    description: 'Main storage facility',
    location: 'Building A',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateWarehouseDto: CreateWarehouseDto = {
    name: 'Main Warehouse',
    code: 'WH001',
    description: 'Main storage facility',
    location: 'Building A',
  };

  const mockUpdateWarehouseDto: UpdateWarehouseDto = {
    name: 'Updated Warehouse',
    description: 'Updated description',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WarehouseService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<WarehouseService>(WarehouseService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a warehouse', async () => {
      mockPrismaService.warehouse.create.mockResolvedValue(mockWarehouse);

      const result = await service.create(mockCreateWarehouseDto);

      expect(prisma.warehouse.create).toHaveBeenCalledWith({
        data: mockCreateWarehouseDto,
      });
      expect(result).toEqual(mockWarehouse);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockPrismaService.warehouse.create.mockRejectedValue(error);

      await expect(service.create(mockCreateWarehouseDto)).rejects.toThrow(
        error,
      );
    });
  });

  describe('findAll', () => {
    it('should return all warehouses', async () => {
      const mockWarehouses = [mockWarehouse];
      mockPrismaService.warehouse.findMany.mockResolvedValue(mockWarehouses);

      const result = await service.findAll();

      expect(prisma.warehouse.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockWarehouses);
    });

    it('should return empty array when no warehouses', async () => {
      mockPrismaService.warehouse.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a warehouse by id', async () => {
      const mockWarehouseWithRelations = {
        ...mockWarehouse,
        batches: [],
        stockMovements: [],
      };
      mockPrismaService.warehouse.findUnique.mockResolvedValue(
        mockWarehouseWithRelations,
      );

      const result = await service.findOne(1);

      expect(prisma.warehouse.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          batches: {
            include: {
              product: true,
            },
          },
          stockMovements: {
            include: {
              product: true,
              batch: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });
      expect(result).toEqual(mockWarehouseWithRelations);
    });

    it('should throw NotFoundException when warehouse not found', async () => {
      mockPrismaService.warehouse.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Warehouse with ID 999 not found'),
      );
    });
  });

  describe('update', () => {
    it('should update a warehouse', async () => {
      const mockWarehouseWithRelations = {
        ...mockWarehouse,
        batches: [],
        stockMovements: [],
      };
      const updatedWarehouse = { ...mockWarehouse, ...mockUpdateWarehouseDto };

      // Mock findOne call
      mockPrismaService.warehouse.findUnique.mockResolvedValue(
        mockWarehouseWithRelations,
      );
      mockPrismaService.warehouse.update.mockResolvedValue(updatedWarehouse);

      const result = await service.update(1, mockUpdateWarehouseDto);

      expect(prisma.warehouse.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: mockUpdateWarehouseDto,
      });
      expect(result).toEqual(updatedWarehouse);
    });

    it('should throw NotFoundException when updating non-existent warehouse', async () => {
      mockPrismaService.warehouse.findUnique.mockResolvedValue(null);

      await expect(
        service.update(999, mockUpdateWarehouseDto),
      ).rejects.toThrow(
        new NotFoundException('Warehouse with ID 999 not found'),
      );
    });
  });

  describe('remove', () => {
    it('should delete a warehouse', async () => {
      const mockWarehouseWithRelations = {
        ...mockWarehouse,
        batches: [],
        stockMovements: [],
      };

      // Mock findOne call
      mockPrismaService.warehouse.findUnique.mockResolvedValue(
        mockWarehouseWithRelations,
      );
      mockPrismaService.warehouse.delete.mockResolvedValue(mockWarehouse);

      const result = await service.remove(1);

      expect(prisma.warehouse.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockWarehouse);
    });

    it('should throw NotFoundException when deleting non-existent warehouse', async () => {
      mockPrismaService.warehouse.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Warehouse with ID 999 not found'),
      );
    });
  });

  describe('getStockLevels', () => {
    it('should calculate stock levels correctly', async () => {
      const mockStockMovements = [
        {
          productId: 1,
          warehouseId: 1,
          movementType: 'IN',
          quantity: 100,
          product: { id: 1, name: 'Product 1' },
        },
        {
          productId: 1,
          warehouseId: 1,
          movementType: 'OUT',
          quantity: 30,
          product: { id: 1, name: 'Product 1' },
        },
        {
          productId: 2,
          warehouseId: 1,
          movementType: 'IN',
          quantity: 50,
          product: { id: 2, name: 'Product 2' },
        },
      ];

      mockPrismaService.stockMovement.findMany.mockResolvedValue(
        mockStockMovements,
      );

      const result = await service.getStockLevels(1);

      expect(prisma.stockMovement.findMany).toHaveBeenCalledWith({
        where: { warehouseId: 1 },
        include: {
          product: true,
        },
      });

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        product: { id: 1, name: 'Product 1' },
        quantity: 70, // 100 - 30
      });
      expect(result[1]).toMatchObject({
        product: { id: 2, name: 'Product 2' },
        quantity: 50,
      });
    });

    it('should handle adjustments correctly', async () => {
      const mockStockMovements = [
        {
          productId: 1,
          warehouseId: 1,
          movementType: 'IN',
          quantity: 100,
          product: { id: 1, name: 'Product 1' },
        },
        {
          productId: 1,
          warehouseId: 1,
          movementType: 'ADJ',
          quantity: -10,
          product: { id: 1, name: 'Product 1' },
        },
      ];

      mockPrismaService.stockMovement.findMany.mockResolvedValue(
        mockStockMovements,
      );

      const result = await service.getStockLevels(1);

      expect(result[0]).toMatchObject({
        product: { id: 1, name: 'Product 1' },
        quantity: 90, // 100 + (-10)
      });
    });

    it('should return empty array when no stock movements', async () => {
      mockPrismaService.stockMovement.findMany.mockResolvedValue([]);

      const result = await service.getStockLevels(1);

      expect(result).toEqual([]);
    });
  });
});
