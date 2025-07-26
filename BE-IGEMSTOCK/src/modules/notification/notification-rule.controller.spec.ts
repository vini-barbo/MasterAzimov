import { Test, TestingModule } from '@nestjs/testing';
import { NotificationRuleController } from './notification-rule.controller';
import { NotificationRuleService } from './notification-rule.service';
import { CreateNotificationRuleDto } from './dto/create-notification-rule.dto';
import { UpdateNotificationRuleDto } from './dto/update-notification-rule.dto';
import { NotFoundException } from '@nestjs/common';

describe('NotificationRuleController', () => {
  let controller: NotificationRuleController;
  let service: NotificationRuleService;

  const mockNotificationRuleService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByType: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    activate: jest.fn(),
    deactivate: jest.fn(),
  };

  const mockNotificationRule = {
    id: 1,
    name: 'Low Stock Alert',
    description: 'Alert when stock is low',
    type: 'LOW_STOCK',
    isActive: true,
    conditions: { threshold: 10 },
    channels: ['email'],
    recipients: ['admin@example.com'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateDto: CreateNotificationRuleDto = {
    name: 'Low Stock Alert',
    description: 'Alert when stock is low',
    type: 'LOW_STOCK',
    conditions: { threshold: 10 },
    channels: ['email'],
    recipients: ['admin@example.com'],
  };

  const mockUpdateDto: UpdateNotificationRuleDto = {
    name: 'Updated Alert',
    conditions: { threshold: 5 },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationRuleController],
      providers: [
        {
          provide: NotificationRuleService,
          useValue: mockNotificationRuleService,
        },
      ],
    }).compile();

    controller = module.get<NotificationRuleController>(
      NotificationRuleController,
    );
    service = module.get<NotificationRuleService>(NotificationRuleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a notification rule', async () => {
      mockNotificationRuleService.create.mockResolvedValue(
        mockNotificationRule,
      );

      const result = await controller.create(mockCreateDto);

      expect(service.create).toHaveBeenCalledWith(mockCreateDto);
      expect(result).toEqual(mockNotificationRule);
    });
  });

  describe('findAll', () => {
    it('should return all notification rules', async () => {
      const mockRules = [mockNotificationRule];
      mockNotificationRuleService.findAll.mockResolvedValue(mockRules);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockRules);
    });

    it('should filter by active status', async () => {
      const mockRules = [mockNotificationRule];
      mockNotificationRuleService.findAll.mockResolvedValue(mockRules);

      const result = await controller.findAll('true');

      expect(service.findAll).toHaveBeenCalledWith(true);
      expect(result).toEqual(mockRules);
    });
  });

  describe('findByType', () => {
    it('should return rules by type', async () => {
      const mockRules = [mockNotificationRule];
      mockNotificationRuleService.findByType.mockResolvedValue(mockRules);

      const result = await controller.findByType('LOW_STOCK');

      expect(service.findByType).toHaveBeenCalledWith('LOW_STOCK');
      expect(result).toEqual(mockRules);
    });
  });

  describe('findOne', () => {
    it('should return a notification rule by id', async () => {
      mockNotificationRuleService.findOne.mockResolvedValue(
        mockNotificationRule,
      );

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockNotificationRule);
    });

    it('should throw NotFoundException when rule not found', async () => {
      mockNotificationRuleService.findOne.mockRejectedValue(
        new NotFoundException('Notification rule with ID 999 not found'),
      );

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a notification rule', async () => {
      const updatedRule = { ...mockNotificationRule, ...mockUpdateDto };
      mockNotificationRuleService.update.mockResolvedValue(updatedRule);

      const result = await controller.update(1, mockUpdateDto);

      expect(service.update).toHaveBeenCalledWith(1, mockUpdateDto);
      expect(result).toEqual(updatedRule);
    });
  });

  describe('activate', () => {
    it('should activate a notification rule', async () => {
      const activatedRule = { ...mockNotificationRule, isActive: true };
      mockNotificationRuleService.activate.mockResolvedValue(activatedRule);

      const result = await controller.activate(1);

      expect(service.activate).toHaveBeenCalledWith(1);
      expect(result).toEqual(activatedRule);
    });
  });

  describe('deactivate', () => {
    it('should deactivate a notification rule', async () => {
      const deactivatedRule = { ...mockNotificationRule, isActive: false };
      mockNotificationRuleService.deactivate.mockResolvedValue(deactivatedRule);

      const result = await controller.deactivate(1);

      expect(service.deactivate).toHaveBeenCalledWith(1);
      expect(result).toEqual(deactivatedRule);
    });
  });

  describe('remove', () => {
    it('should delete a notification rule', async () => {
      mockNotificationRuleService.remove.mockResolvedValue(
        mockNotificationRule,
      );

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockNotificationRule);
    });
  });
});
