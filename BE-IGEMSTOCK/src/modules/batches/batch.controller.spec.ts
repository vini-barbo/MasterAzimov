import { Test, TestingModule } from '@nestjs/testing';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import { CreateBatchDto, UpdateBatchDto } from './dto';
import { NotFoundException } from '@nestjs/common';

describe('BatchController', () => {
  let controller: BatchController;
  let service: BatchService;

  const mockBatchService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findExpiringBatches: jest.fn(),
    findByProduct: jest.fn(),
    findByWarehouse: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockBatch = {
    id: 1,
    batchCode: 'BATCH001',
    productId: 1,
    warehouseId: 1,
    quantity: 100,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateBatchDto: CreateBatchDto = {
    batchCode: 'BATCH001',
    productId: 1,
    warehouseId: 1,
    quantity: 100,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };

  const mockUpdateBatchDto: UpdateBatchDto = {
    quantity: 150,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BatchController],
      providers: [
        {
          provide: BatchService,
          useValue: mockBatchService,
        },
      ],
    }).compile();

    controller = module.get<BatchController>(BatchController);
    service = module.get<BatchService>(BatchService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a batch', async () => {
      mockBatchService.create.mockResolvedValue(mockBatch);

      const result = await controller.create(mockCreateBatchDto);

      expect(service.create).toHaveBeenCalledWith(mockCreateBatchDto);
      expect(result).toEqual(mockBatch);
    });

    it('should handle service errors', async () => {
      const error = new Error('Database error');
      mockBatchService.create.mockRejectedValue(error);

      await expect(controller.create(mockCreateBatchDto)).rejects.toThrow(
        error,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of batches', async () => {
      const mockBatches = [mockBatch];
      mockBatchService.findAll.mockResolvedValue(mockBatches);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockBatches);
    });

    it('should return empty array when no batches exist', async () => {
      mockBatchService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findExpiringBatches', () => {
    it('should return expiring batches with default days', async () => {
      const expiringBatches = [mockBatch];
      mockBatchService.findExpiringBatches.mockResolvedValue(expiringBatches);

      const result = await controller.findExpiringBatches();

      expect(service.findExpiringBatches).toHaveBeenCalledWith(30);
      expect(result).toEqual(expiringBatches);
    });

    it('should return expiring batches with custom days', async () => {
      const expiringBatches = [mockBatch];
      mockBatchService.findExpiringBatches.mockResolvedValue(expiringBatches);

      const result = await controller.findExpiringBatches('60');

      expect(service.findExpiringBatches).toHaveBeenCalledWith(60);
      expect(result).toEqual(expiringBatches);
    });
  });

  describe('findByProduct', () => {
    it('should return batches for a product', async () => {
      const productBatches = [mockBatch];
      mockBatchService.findByProduct.mockResolvedValue(productBatches);

      const result = await controller.findByProduct(1);

      expect(service.findByProduct).toHaveBeenCalledWith(1);
      expect(result).toEqual(productBatches);
    });
  });

  describe('findByWarehouse', () => {
    it('should return batches for a warehouse', async () => {
      const warehouseBatches = [mockBatch];
      mockBatchService.findByWarehouse.mockResolvedValue(warehouseBatches);

      const result = await controller.findByWarehouse(1);

      expect(service.findByWarehouse).toHaveBeenCalledWith(1);
      expect(result).toEqual(warehouseBatches);
    });
  });

  describe('findOne', () => {
    it('should return a batch by id', async () => {
      mockBatchService.findOne.mockResolvedValue(mockBatch);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockBatch);
    });

    it('should throw NotFoundException when batch not found', async () => {
      mockBatchService.findOne.mockRejectedValue(
        new NotFoundException('Batch with ID 999 not found'),
      );

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a batch', async () => {
      const updatedBatch = { ...mockBatch, ...mockUpdateBatchDto };
      mockBatchService.update.mockResolvedValue(updatedBatch);

      const result = await controller.update(1, mockUpdateBatchDto);

      expect(service.update).toHaveBeenCalledWith(1, mockUpdateBatchDto);
      expect(result).toEqual(updatedBatch);
    });

    it('should throw NotFoundException when updating non-existent batch', async () => {
      mockBatchService.update.mockRejectedValue(
        new NotFoundException('Batch with ID 999 not found'),
      );

      await expect(controller.update(999, mockUpdateBatchDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a batch', async () => {
      mockBatchService.remove.mockResolvedValue(mockBatch);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockBatch);
    });

    it('should throw NotFoundException when deleting non-existent batch', async () => {
      mockBatchService.remove.mockRejectedValue(
        new NotFoundException('Batch with ID 999 not found'),
      );

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
