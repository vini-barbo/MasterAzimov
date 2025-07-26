import { Test, TestingModule } from '@nestjs/testing';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { NotFoundException } from '@nestjs/common';

describe('SaleController', () => {
  let controller: SaleController;
  let service: SaleService;

  const mockSaleService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    getSalesByDateRange: jest.fn(),
    getSalesStats: jest.fn(),
    getTopSellingProducts: jest.fn(),
  };

  const mockSale = {
    id: 1,
    saleNumber: 'SALE-001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '1234567890',
    totalAmount: 150.0,
    status: 'COMPLETED',
    saleDate: new Date(),
    notes: 'Test sale',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateSaleDto: CreateSaleDto = {
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '1234567890',
    totalAmount: 150.0,
    status: 'COMPLETED',
    notes: 'Test sale',
    items: [
      {
        productId: 1,
        quantity: 2,
        unitPrice: 75.0,
        totalPrice: 150.0,
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaleController],
      providers: [
        {
          provide: SaleService,
          useValue: mockSaleService,
        },
      ],
    }).compile();

    controller = module.get<SaleController>(SaleController);
    service = module.get<SaleService>(SaleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a sale', async () => {
      mockSaleService.create.mockResolvedValue(mockSale);

      const result = await controller.create(mockCreateSaleDto);

      expect(service.create).toHaveBeenCalledWith(mockCreateSaleDto);
      expect(result).toEqual(mockSale);
    });

    it('should handle service errors', async () => {
      const error = new Error('Database error');
      mockSaleService.create.mockRejectedValue(error);

      await expect(controller.create(mockCreateSaleDto)).rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    it('should return an array of sales', async () => {
      const mockSales = [mockSale];
      mockSaleService.findAll.mockResolvedValue(mockSales);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockSales);
    });

    it('should filter by status', async () => {
      const mockSales = [mockSale];
      mockSaleService.findAll.mockResolvedValue(mockSales);

      const result = await controller.findAll('COMPLETED');

      expect(service.findAll).toHaveBeenCalledWith('COMPLETED');
      expect(result).toEqual(mockSales);
    });

    it('should return empty array when no sales exist', async () => {
      mockSaleService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a sale by id', async () => {
      mockSaleService.findOne.mockResolvedValue(mockSale);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockSale);
    });

    it('should throw NotFoundException when sale not found', async () => {
      mockSaleService.findOne.mockRejectedValue(
        new NotFoundException('Sale with ID 999 not found'),
      );

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getSalesByDateRange', () => {
    it('should return sales within date range', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';
      const mockSales = [mockSale];

      mockSaleService.getSalesByDateRange.mockResolvedValue(mockSales);

      const result = await controller.getSalesByDateRange(startDate, endDate);

      expect(service.getSalesByDateRange).toHaveBeenCalledWith(
        new Date(startDate),
        new Date(endDate),
      );
      expect(result).toEqual(mockSales);
    });
  });

  describe('getSalesStats', () => {
    it('should return sales statistics', async () => {
      const mockStats = {
        totalSales: 10,
        totalRevenue: 1500.0,
        averageOrderValue: 150.0,
        topCustomers: [],
      };

      mockSaleService.getSalesStats.mockResolvedValue(mockStats);

      const result = await controller.getSalesStats();

      expect(service.getSalesStats).toHaveBeenCalled();
      expect(result).toEqual(mockStats);
    });

    it('should filter stats by date range', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';
      const mockStats = {
        totalSales: 5,
        totalRevenue: 750.0,
        averageOrderValue: 150.0,
        topCustomers: [],
      };

      mockSaleService.getSalesStats.mockResolvedValue(mockStats);

      const result = await controller.getSalesStats(startDate, endDate);

      expect(service.getSalesStats).toHaveBeenCalledWith(
        new Date(startDate),
        new Date(endDate),
      );
      expect(result).toEqual(mockStats);
    });
  });

  describe('getTopSellingProducts', () => {
    it('should return top selling products', async () => {
      const mockTopProducts = [
        {
          productId: 1,
          productName: 'Product 1',
          totalQuantitySold: 100,
          totalRevenue: 1000.0,
        },
      ];

      mockSaleService.getTopSellingProducts.mockResolvedValue(mockTopProducts);

      const result = await controller.getTopSellingProducts();

      expect(service.getTopSellingProducts).toHaveBeenCalledWith(10);
      expect(result).toEqual(mockTopProducts);
    });

    it('should limit results', async () => {
      const limit = '5';
      const mockTopProducts = [
        {
          productId: 1,
          productName: 'Product 1',
          totalQuantitySold: 100,
          totalRevenue: 1000.0,
        },
      ];

      mockSaleService.getTopSellingProducts.mockResolvedValue(mockTopProducts);

      const result = await controller.getTopSellingProducts(limit);

      expect(service.getTopSellingProducts).toHaveBeenCalledWith(5);
      expect(result).toEqual(mockTopProducts);
    });
  });
});
