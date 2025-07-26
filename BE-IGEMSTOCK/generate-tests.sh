#!/bin/bash

# Script para gerar testes automaticamente para todos os controllers e services
# Executa a partir do diretório BE-IGEMSTOCK

echo "🧪 Gerando testes para todos os Controllers e Services..."

# Função para gerar teste de controller
generate_controller_test() {
    local controller_file=$1
    local test_file="${controller_file%.ts}.spec.ts"
    
    if [ -f "$test_file" ]; then
        echo "⚠️  Teste já existe: $test_file"
        return
    fi
    
    echo "📝 Gerando teste para: $controller_file"
    
    # Extrair nome do controller e service
    local controller_name=$(basename "$controller_file" .controller.ts)
    local controller_class=$(echo "$controller_name" | sed 's/\b\w/\U&/g' | sed 's/-//g')Controller
    local service_class=$(echo "$controller_name" | sed 's/\b\w/\U&/g' | sed 's/-//g')Service
    local module_path=$(dirname "$controller_file")
    
    cat > "$test_file" << EOF
import { Test, TestingModule } from '@nestjs/testing';
import { ${controller_class} } from './${controller_name}.controller';
import { ${service_class} } from './${controller_name}.service';
import { NotFoundException } from '@nestjs/common';

describe('${controller_class}', () => {
  let controller: ${controller_class};
  let service: ${service_class};

  const mock${service_class} = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [${controller_class}],
      providers: [
        {
          provide: ${service_class},
          useValue: mock${service_class},
        },
      ],
    }).compile();

    controller = module.get<${controller_class}>(${controller_class});
    service = module.get<${service_class}>(${service_class});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create successfully', async () => {
      const mockData = { id: 1, name: 'Test' };
      const createDto = { name: 'Test' };
      
      mock${service_class}.create.mockResolvedValue(mockData);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockData);
    });
  });

  describe('findAll', () => {
    it('should return an array', async () => {
      const mockData = [{ id: 1, name: 'Test' }];
      mock${service_class}.findAll.mockResolvedValue(mockData);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });

  describe('findOne', () => {
    it('should return one item', async () => {
      const mockData = { id: 1, name: 'Test' };
      mock${service_class}.findOne.mockResolvedValue(mockData);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockData);
    });

    it('should throw NotFoundException when not found', async () => {
      mock${service_class}.findOne.mockRejectedValue(
        new NotFoundException('Not found'),
      );

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update successfully', async () => {
      const mockData = { id: 1, name: 'Updated' };
      const updateDto = { name: 'Updated' };
      
      mock${service_class}.update.mockResolvedValue(mockData);

      const result = await controller.update(1, updateDto);

      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(mockData);
    });
  });

  describe('remove', () => {
    it('should remove successfully', async () => {
      const mockData = { id: 1, name: 'Test' };
      mock${service_class}.remove.mockResolvedValue(mockData);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockData);
    });
  });
});
EOF

    echo "✅ Teste gerado: $test_file"
}

# Função para gerar teste de service
generate_service_test() {
    local service_file=$1
    local test_file="${service_file%.ts}.spec.ts"
    
    if [ -f "$test_file" ]; then
        echo "⚠️  Teste já existe: $test_file"
        return
    fi
    
    echo "📝 Gerando teste para: $service_file"
    
    # Extrair nome do service
    local service_name=$(basename "$service_file" .service.ts)
    local service_class=$(echo "$service_name" | sed 's/\b\w/\U&/g' | sed 's/-//g')Service
    
    cat > "$test_file" << EOF
import { Test, TestingModule } from '@nestjs/testing';
import { ${service_class} } from './${service_name}.service';
import { PrismaService } from '../../database/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('${service_class}', () => {
  let service: ${service_class};
  let prisma: PrismaService;

  const mockPrismaService = {
    $(echo "$service_name" | sed 's/-//g'): {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ${service_class},
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<${service_class}>(${service_class});
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create successfully', async () => {
      const mockData = { id: 1, name: 'Test' };
      const createDto = { name: 'Test' };
      
      mockPrismaService.$(echo "$service_name" | sed 's/-//g').create.mockResolvedValue(mockData);

      const result = await service.create(createDto);

      expect(prisma.$(echo "$service_name" | sed 's/-//g').create).toHaveBeenCalledWith({
        data: createDto,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe('findAll', () => {
    it('should return all items', async () => {
      const mockData = [{ id: 1, name: 'Test' }];
      mockPrismaService.$(echo "$service_name" | sed 's/-//g').findMany.mockResolvedValue(mockData);

      const result = await service.findAll();

      expect(result).toEqual(mockData);
    });
  });

  describe('findOne', () => {
    it('should return one item', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockPrismaService.$(echo "$service_name" | sed 's/-//g').findUnique.mockResolvedValue(mockData);

      const result = await service.findOne(1);

      expect(result).toEqual(mockData);
    });

    it('should throw NotFoundException when not found', async () => {
      mockPrismaService.$(echo "$service_name" | sed 's/-//g').findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update successfully', async () => {
      const mockData = { id: 1, name: 'Updated' };
      const updateDto = { name: 'Updated' };
      
      mockPrismaService.$(echo "$service_name" | sed 's/-//g').findUnique.mockResolvedValue({ id: 1, name: 'Test' });
      mockPrismaService.$(echo "$service_name" | sed 's/-//g').update.mockResolvedValue(mockData);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(mockData);
    });
  });

  describe('remove', () => {
    it('should remove successfully', async () => {
      const mockData = { id: 1, name: 'Test' };
      
      mockPrismaService.$(echo "$service_name" | sed 's/-//g').findUnique.mockResolvedValue(mockData);
      mockPrismaService.$(echo "$service_name" | sed 's/-//g').delete.mockResolvedValue(mockData);

      const result = await service.remove(1);

      expect(result).toEqual(mockData);
    });
  });
});
EOF

    echo "✅ Teste gerado: $test_file"
}

# Encontrar todos os controllers e gerar testes
echo "🔍 Procurando controllers..."
find src/modules -name "*.controller.ts" | while read -r file; do
    generate_controller_test "$file"
done

echo ""

# Encontrar todos os services e gerar testes
echo "🔍 Procurando services..."
find src/modules -name "*.service.ts" | while read -r file; do
    generate_service_test "$file"
done

echo ""
echo "🎉 Geração de testes concluída!"
echo ""
echo "Para executar os testes:"
echo "  npm test                    # Executar todos os testes"
echo "  npm run test:watch          # Executar em modo watch"
echo "  npm run test:cov            # Executar com coverage"
echo ""
