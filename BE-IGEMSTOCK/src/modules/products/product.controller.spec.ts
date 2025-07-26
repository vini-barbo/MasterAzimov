import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findBySku: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getStockLevels: jest.fn(),
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
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      mockProductService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(mockCreateProductDto);

      expect(service.create).toHaveBeenCalledWith(mockCreateProductDto);
      expect(result).toEqual(mockProduct);
    });

    it('should handle service errors', async () => {
      const error = new Error('Database error');
      mockProductService.create.mockRejectedValue(error);

      await expect(controller.create(mockCreateProductDto)).rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const mockProducts = [mockProduct];
      mockProductService.findAll.mockResolvedValue(mockProducts);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });

    it('should return empty array when no products exist', async () => {
      mockProductService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      mockProductService.findOne.mockResolvedValue(mockProduct);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException when product not found', async () => {
      mockProductService.findOne.mockRejectedValue(new NotFoundException('Product with ID 999 not found'));

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findBySku', () => {
    it('should return a product by SKU', async () => {
      mockProductService.findBySku.mockResolvedValue(mockProduct);

      const result = await controller.findBySku('TEST-001');

      expect(service.findBySku).toHaveBeenCalledWith('TEST-001');
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException when product with SKU not found', async () => {
      mockProductService.findBySku.mockRejectedValue(new NotFoundException('Product with SKU NOT-FOUND not found'));

      await expect(controller.findBySku('NOT-FOUND')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStockLevels', () => {
    it('should return stock levels for a product', async () => {
      const mockStockLevels = [
        {
          warehouse: { id: 1, name: 'Warehouse 1' },
          quantity: 100,
        },
      ];
      mockProductService.getStockLevels.mockResolvedValue(mockStockLevels);

      const result = await controller.getStockLevels(1);

      expect(service.getStockLevels).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockStockLevels);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updatedProduct = { ...mockProduct, ...mockUpdateProductDto };
      mockProductService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update(1, mockUpdateProductDto);

      expect(service.update).toHaveBeenCalledWith(1, mockUpdateProductDto);
      expect(result).toEqual(updatedProduct);
    });

    it('should throw NotFoundException when updating non-existent product', async () => {
      mockProductService.update.mockRejectedValue(new NotFoundException('Product with ID 999 not found'));

      await expect(controller.update(999, mockUpdateProductDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      mockProductService.remove.mockResolvedValue(mockProduct);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException when deleting non-existent product', async () => {
      mockProductService.remove.mockRejectedValue(new NotFoundException('Product with ID 999 not found'));

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
