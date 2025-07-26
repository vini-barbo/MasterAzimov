import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto, UpdateWarehouseDto } from './dto';
import { NotFoundException } from '@nestjs/common';

describe('WarehouseController', () => {
  let controller: WarehouseController;
  let service: WarehouseService;

  const mockWarehouseService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getStockLevels: jest.fn(),
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
      controllers: [WarehouseController],
      providers: [
        {
          provide: WarehouseService,
          useValue: mockWarehouseService,
        },
      ],
    }).compile();

    controller = module.get<WarehouseController>(WarehouseController);
    service = module.get<WarehouseService>(WarehouseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a warehouse', async () => {
      mockWarehouseService.create.mockResolvedValue(mockWarehouse);

      const result = await controller.create(mockCreateWarehouseDto);

      expect(service.create).toHaveBeenCalledWith(mockCreateWarehouseDto);
      expect(result).toEqual(mockWarehouse);
    });

    it('should handle service errors', async () => {
      const error = new Error('Database error');
      mockWarehouseService.create.mockRejectedValue(error);

      await expect(controller.create(mockCreateWarehouseDto)).rejects.toThrow(
        error,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of warehouses', async () => {
      const mockWarehouses = [mockWarehouse];
      mockWarehouseService.findAll.mockResolvedValue(mockWarehouses);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockWarehouses);
    });

    it('should return empty array when no warehouses exist', async () => {
      mockWarehouseService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a warehouse by id', async () => {
      mockWarehouseService.findOne.mockResolvedValue(mockWarehouse);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockWarehouse);
    });

    it('should throw NotFoundException when warehouse not found', async () => {
      mockWarehouseService.findOne.mockRejectedValue(
        new NotFoundException('Warehouse with ID 999 not found'),
      );

      await expect(controller.findOne(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getStockLevels', () => {
    it('should return stock levels for a warehouse', async () => {
      const mockStockLevels = [
        {
          product: { id: 1, name: 'Product 1' },
          quantity: 100,
        },
      ];
      mockWarehouseService.getStockLevels.mockResolvedValue(mockStockLevels);

      const result = await controller.getStockLevels(1);

      expect(service.getStockLevels).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockStockLevels);
    });
  });

  describe('update', () => {
    it('should update a warehouse', async () => {
      const updatedWarehouse = { ...mockWarehouse, ...mockUpdateWarehouseDto };
      mockWarehouseService.update.mockResolvedValue(updatedWarehouse);

      const result = await controller.update(1, mockUpdateWarehouseDto);

      expect(service.update).toHaveBeenCalledWith(1, mockUpdateWarehouseDto);
      expect(result).toEqual(updatedWarehouse);
    });

    it('should throw NotFoundException when updating non-existent warehouse', async () => {
      mockWarehouseService.update.mockRejectedValue(
        new NotFoundException('Warehouse with ID 999 not found'),
      );

      await expect(
        controller.update(999, mockUpdateWarehouseDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a warehouse', async () => {
      mockWarehouseService.remove.mockResolvedValue(mockWarehouse);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockWarehouse);
    });

    it('should throw NotFoundException when deleting non-existent warehouse', async () => {
      mockWarehouseService.remove.mockRejectedValue(
        new NotFoundException('Warehouse with ID 999 not found'),
      );

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
