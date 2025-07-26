import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../../database/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';

describe('ProductService', () => {
  let service: ProductService;
  let prisma: PrismaService;

  const mockPrismaService = {
    product: {
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

  const mockProduct = {
    id: 1,
    name: 'Test Product',
    sku: 'TEST-001',
    description: 'Test product description',
    category: 'Test Category',
    unit: 'UNIT',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateProductDto: CreateProductDto = {
    name: 'Test Product',
    sku: 'TEST-001',
    description: 'Test product description',
    category: 'Test Category',
    unit: 'UNIT',
  };

  const mockUpdateProductDto: UpdateProductDto = {
    name: 'Updated Product',
    description: 'Updated description',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      mockPrismaService.product.create.mockResolvedValue(mockProduct);

      const result = await service.create(mockCreateProductDto);

      expect(prisma.product.create).toHaveBeenCalledWith({
        data: mockCreateProductDto,
      });
      expect(result).toEqual(mockProduct);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockPrismaService.product.create.mockRejectedValue(error);

      await expect(service.create(mockCreateProductDto)).rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const mockProducts = [mockProduct];
      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);

      const result = await service.findAll();

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockProducts);
    });

    it('should return empty array when no products', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const mockProductWithRelations = {
        ...mockProduct,
        batches: [],
        stockMovements: [],
      };
      mockPrismaService.product.findUnique.mockResolvedValue(mockProductWithRelations);

      const result = await service.findOne(1);

      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          batches: {
            include: {
              warehouse: true,
            },
          },
          stockMovements: {
            include: {
              warehouse: true,
              batch: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });
      expect(result).toEqual(mockProductWithRelations);
    });

    it('should throw NotFoundException when product not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Product with ID 999 not found'),
      );
    });
  });

  describe('findBySku', () => {
    it('should return a product by SKU', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      const result = await service.findBySku('TEST-001');

      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { sku: 'TEST-001' },
      });
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException when product with SKU not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.findBySku('NOT-FOUND')).rejects.toThrow(
        new NotFoundException('Product with SKU NOT-FOUND not found'),
      );
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const mockProductWithRelations = {
        ...mockProduct,
        batches: [],
        stockMovements: [],
      };
      const updatedProduct = { ...mockProduct, ...mockUpdateProductDto };

      // Mock findOne call
      mockPrismaService.product.findUnique.mockResolvedValue(mockProductWithRelations);
      mockPrismaService.product.update.mockResolvedValue(updatedProduct);

      const result = await service.update(1, mockUpdateProductDto);

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: mockUpdateProductDto,
      });
      expect(result).toEqual(updatedProduct);
    });

    it('should throw NotFoundException when updating non-existent product', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.update(999, mockUpdateProductDto)).rejects.toThrow(
        new NotFoundException('Product with ID 999 not found'),
      );
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      const mockProductWithRelations = {
        ...mockProduct,
        batches: [],
        stockMovements: [],
      };

      // Mock findOne call
      mockPrismaService.product.findUnique.mockResolvedValue(mockProductWithRelations);
      mockPrismaService.product.delete.mockResolvedValue(mockProduct);

      const result = await service.remove(1);

      expect(prisma.product.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException when deleting non-existent product', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Product with ID 999 not found'),
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
          warehouse: { id: 1, name: 'Warehouse 1' },
        },
        {
          productId: 1,
          warehouseId: 1,
          movementType: 'OUT',
          quantity: 30,
          warehouse: { id: 1, name: 'Warehouse 1' },
        },
        {
          productId: 1,
          warehouseId: 2,
          movementType: 'IN',
          quantity: 50,
          warehouse: { id: 2, name: 'Warehouse 2' },
        },
      ];

      mockPrismaService.stockMovement.findMany.mockResolvedValue(mockStockMovements);

      const result = await service.getStockLevels(1);

      expect(prisma.stockMovement.findMany).toHaveBeenCalledWith({
        where: { productId: 1 },
        include: {
          warehouse: true,
        },
      });

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        warehouse: { id: 1, name: 'Warehouse 1' },
        quantity: 70, // 100 - 30
      });
      expect(result[1]).toMatchObject({
        warehouse: { id: 2, name: 'Warehouse 2' },
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
          warehouse: { id: 1, name: 'Warehouse 1' },
        },
        {
          productId: 1,
          warehouseId: 1,
          movementType: 'ADJ',
          quantity: -10,
          warehouse: { id: 1, name: 'Warehouse 1' },
        },
      ];

      mockPrismaService.stockMovement.findMany.mockResolvedValue(mockStockMovements);

      const result = await service.getStockLevels(1);

      expect(result[0]).toMatchObject({
        warehouse: { id: 1, name: 'Warehouse 1' },
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
