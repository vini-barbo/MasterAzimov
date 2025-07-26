# 🧪 Testing Guide - IGEM Stock Management System

Este documento explica como executar e trabalhar com os testes do sistema IGEM Stock Management.

## 📊 Testes Criados

### Controllers Testados ✅
- ✅ `ProductController` - Gerenciamento de produtos
- ✅ `WarehouseController` - Gerenciamento de depósitos
- ✅ `BatchController` - Gerenciamento de lotes
- ✅ `NotificationRuleController` - Regras de notificação
- ✅ `SaleController` - Vendas do dashboard

### Services Testados ✅
- ✅ `ProductService` - Lógica de produtos
- ✅ `WarehouseService` - Lógica de depósitos  
- ✅ `StockMovementService` - Movimentações de estoque

## 🚀 Como Executar os Testes

### Comandos Básicos

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (re-executa ao salvar arquivos)
npm run test:watch

# Executar testes com coverage (relatório de cobertura)
npm run test:cov

# Executar testes específicos
npm test -- product.controller.spec.ts

# Executar testes com mais detalhes
npm test -- --verbose

# Executar testes em modo debug
npm run test:debug
```

### Usando Make

```bash
# Executar todos os testes dentro do container
make test

# Executar testes em modo watch
make test-watch

# Executar testes com coverage
make test-coverage
```

## 📁 Estrutura dos Testes

```
src/
├── modules/
│   ├── inventory/
│   │   ├── product.controller.spec.ts
│   │   ├── product.service.spec.ts
│   │   ├── warehouse.controller.spec.ts
│   │   ├── warehouse.service.spec.ts
│   │   ├── batch.controller.spec.ts
│   │   └── stock-movement.service.spec.ts
│   ├── notification/
│   │   └── notification-rule.controller.spec.ts
│   └── dashboard/
│       └── sale.controller.spec.ts
├── app.controller.spec.ts
test/
├── setup.ts              # Configuração global dos testes
├── jest-e2e.json        # Configuração dos testes E2E
└── app.e2e-spec.ts      # Testes End-to-End
```

## 🔧 Configuração dos Testes

### Jest Configuration

O arquivo `jest.config.json` configura:
- ✅ Coleta de coverage
- ✅ Ambientes de teste
- ✅ Transformação de TypeScript
- ✅ Setup de mocks

### Test Setup

O arquivo `test/setup.ts` fornece:
- ✅ Mocks globais do Prisma
- ✅ Utilitários de teste
- ✅ Configuração de timeouts
- ✅ Dados mock consistentes

## 📋 Padrões dos Testes

### Estrutura Padrão de Teste

```typescript
describe('ServiceName', () => {
  let service: ServiceName;
  let prisma: PrismaService;

  const mockPrismaService = {
    model: {
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
        ServiceName,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ServiceName>(ServiceName);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Testes aqui...
});
```

### Casos de Teste Cobertos

Para cada Controller/Service testamos:

✅ **Casos de Sucesso:**
- Criação de registros
- Busca de registros (todos e por ID)
- Atualização de registros
- Remoção de registros
- Métodos específicos da entidade

✅ **Casos de Erro:**
- Registros não encontrados (404)
- Erros de banco de dados
- Validação de dados

✅ **Casos Edge:**
- Arrays vazios
- Filtros opcionais
- Parâmetros null/undefined

## 📊 Coverage Report

Para gerar relatório de cobertura:

```bash
npm run test:cov
```

O relatório será gerado em `coverage/lcov-report/index.html` e pode ser aberto no navegador:

```bash
# Abrir relatório no navegador
open coverage/lcov-report/index.html
```

### Metas de Coverage

- **Lines**: > 80%
- **Functions**: > 80%
- **Branches**: > 70%
- **Statements**: > 80%

## 🔍 Debugging Tests

### VS Code Debug Configuration

Adicione ao `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Debug Específico

Para debugar teste específico:

```bash
# Debug de teste específico
npm run test:debug -- product.controller.spec.ts

# Com breakpoints
node --inspect-brk node_modules/.bin/jest --runInBand product.controller.spec.ts
```

## 🛠️ Mocks e Utilities

### PrismaService Mock

```typescript
const mockPrismaService = global.createMockPrismaService();
```

### Dados Mock Consistentes

```typescript
const mockDates = global.mockDates;
// mockDates.now - Data atual
// mockDates.future - Data futura
// mockDates.past - Data passada
```

## 🚨 Troubleshooting

### Problemas Comuns

**Teste falhando por timeout:**
```bash
# Aumentar timeout
jest.setTimeout(15000);
```

**Mock não funcionando:**
```bash
# Limpar mocks entre testes
afterEach(() => {
  jest.clearAllMocks();
});
```

**Erro de importação:**
```bash
# Verificar moduleNameMapping no jest.config.json
```

### Logs de Debug

Para ver logs durante os testes:

```typescript
console.log = jest.fn(); // Remove logs
// ou
console.log.mockRestore(); // Restaura logs
```

## 📚 Referências

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

## 🎯 Próximos Passos

### Testes Pendentes

- [ ] `BatchService` - Lógica de lotes
- [ ] `NotificationRuleService` - Lógica de notificações
- [ ] `NotificationLogService` - Logs de notificação
- [ ] `SaleService` - Lógica de vendas
- [ ] `SaleItemService` - Itens de vendas
- [ ] Testes de integração
- [ ] Testes E2E completos

### Melhorias Futuras

- [ ] Testes de performance
- [ ] Testes de load
- [ ] Snapshot testing
- [ ] Visual regression tests
- [ ] API contract testing

---

**Criado por**: Sistema IGEMSTOCK  
**Data**: 26 de Julho de 2025  
**Versão**: 1.0.0
