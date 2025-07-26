# Estrutura Modular do Backend IGEMSTOCK

Este documento descreve a nova organização modular do backend, que foi reorganizado para melhor separação de responsabilidades e manutenibilidade.

## 📁 Estrutura de Módulos

O backend agora está organizado em módulos específicos por domínio de negócio:

### 🛍️ **Products Module** (`/src/modules/products/`)
- **Responsabilidade**: Gerenciamento do catálogo de produtos
- **Endpoints**: `/products`
- **Funcionalidades**:
  - CRUD de produtos
  - Consulta por SKU
  - Gerenciamento de informações básicas dos produtos

### 🏬 **Warehouses Module** (`/src/modules/warehouses/`)
- **Responsabilidade**: Gestão de armazéns e locais de armazenamento
- **Endpoints**: `/warehouses`
- **Funcionalidades**:
  - CRUD de armazéns
  - Controle de localizações físicas
  - Gestão de capacidade

### 📦 **Batches Module** (`/src/modules/batches/`)
- **Responsabilidade**: Controle de lotes e rastreabilidade
- **Endpoints**: `/batches`
- **Funcionalidades**:
  - Controle de lotes de produtos
  - Gestão de datas de validade
  - Rastreabilidade de origem

### 📊 **Stock Movements Module** (`/src/modules/stock-movements/`)
- **Responsabilidade**: Registro de movimentações de estoque
- **Endpoints**: `/stock-movements`
- **Funcionalidades**:
  - Registro de entradas (IN)
  - Registro de saídas (OUT)
  - Ajustes de estoque (ADJ)
  - Histórico completo de movimentações

### 💰 **Sales Module** (`/src/modules/sales/`)
- **Responsabilidade**: Gestão de vendas e relatórios
- **Endpoints**: `/sales`
- **Funcionalidades**:
  - CRUD de vendas
  - Controle de itens vendidos
  - Relatórios de vendas
  - Dashboard de vendas

### 🛒 **Purchases Module** (`/src/modules/purchases/`)
- **Responsabilidade**: Gestão de pedidos de compra
- **Endpoints**: `/purchases`
- **Funcionalidades**:
  - CRUD de pedidos de compra
  - Gestão de fornecedores
  - Recebimento de mercadorias
  - Controle de status dos pedidos

### 🏭 **Production Module** (`/src/modules/production/`)
- **Responsabilidade**: Gestão de produção e receitas
- **Endpoints**: `/production`
- **Funcionalidades**:
  - Gestão de receitas (`/production/recipes`)
  - Controle de lotes de produção (`/production/batches`)
  - Planejamento de produção
  - Consumo de matérias-primas

### 👥 **Users Module** (`/src/modules/users/`)
- **Responsabilidade**: Gestão de usuários e autenticação
- **Endpoints**: `/users`
- **Funcionalidades**:
  - CRUD de usuários
  - Controle de permissões
  - Ativação/desativação de contas
  - Gestão de perfis

### 🔔 **Notification Module** (`/src/modules/notification/`)
- **Responsabilidade**: Sistema de notificações e alertas
- **Endpoints**: `/notifications`
- **Funcionalidades**:
  - Alertas de estoque baixo
  - Notificações de vencimento
  - Configuração de regras
  - Histórico de notificações

### 📈 **Dashboard Module** (`/src/modules/dashboard/`)
- **Responsabilidade**: Agregação de dados e métricas
- **Endpoints**: `/dashboard`
- **Funcionalidades**:
  - KPIs do sistema
  - Relatórios consolidados
  - Métricas de performance
  - Visão geral do negócio

### 🏢 **Suppliers Module** (`/src/modules/suppliers/`)
- **Responsabilidade**: Gestão de fornecedores
- **Endpoints**: `/suppliers`
- **Funcionalidades**:
  - CRUD de fornecedores
  - Informações de contato
  - Histórico de compras
  - Avaliação de fornecedores

## 🔄 Migração da Estrutura Antiga

### Antes (Estrutura Monolítica)
```
src/modules/
├── inventory/           # Módulo grande com várias responsabilidades
│   ├── product.*
│   ├── warehouse.*
│   ├── batch.*
│   ├── stock-movement.*
│   └── inventory.module.ts
├── dashboard/
├── notification/
└── suppliers/
```

### Depois (Estrutura Modular)
```
src/modules/
├── products/           # Foco apenas em produtos
├── warehouses/         # Foco apenas em armazéns
├── batches/           # Foco apenas em lotes
├── stock-movements/   # Foco apenas em movimentações
├── sales/             # Nova funcionalidade
├── purchases/         # Nova funcionalidade
├── production/        # Nova funcionalidade
├── users/             # Nova funcionalidade
├── notification/      # Mantido
├── dashboard/         # Mantido
└── suppliers/         # Mantido
```

## 🚀 Vantagens da Nova Estrutura

### 1. **Separação de Responsabilidades**
- Cada módulo tem uma responsabilidade específica e bem definida
- Facilita a manutenção e evolução do código

### 2. **Escalabilidade**
- Novos módulos podem ser adicionados facilmente
- Módulos podem ser desenvolvidos independentemente

### 3. **Testabilidade**
- Testes unitários mais focados
- Mocking mais simples entre módulos

### 4. **Reutilização**
- Serviços podem ser importados e reutilizados entre módulos
- Interfaces bem definidas

### 5. **Desenvolvimento em Equipe**
- Diferentes desenvolvedores podem trabalhar em módulos diferentes
- Reduz conflitos de merge

## 📋 Endpoints Principais

### Products
- `GET /products` - Lista produtos
- `POST /products` - Cria produto
- `GET /products/:id` - Busca produto
- `PUT /products/:id` - Atualiza produto
- `DELETE /products/:id` - Remove produto

### Sales
- `GET /sales` - Lista vendas
- `POST /sales` - Registra venda
- `GET /sales/reports/summary` - Relatório de vendas

### Purchases
- `GET /purchases` - Lista pedidos de compra
- `POST /purchases` - Cria pedido
- `POST /purchases/:id/receive` - Recebe mercadoria

### Production
- `GET /production/recipes` - Lista receitas
- `POST /production/recipes` - Cria receita
- `GET /production/batches` - Lista lotes de produção
- `POST /production/batches` - Inicia produção

### Stock Movements
- `GET /stock-movements` - Histórico de movimentações
- `POST /stock-movements` - Registra movimentação

## 🔧 Como Usar

### 1. **Instalar Dependências**
```bash
npm install
```

### 2. **Configurar Banco de Dados**
```bash
npx prisma generate
npx prisma db push
```

### 3. **Executar Migrações**
```bash
./scripts/apply_new_migrations.sh
```

### 4. **Iniciar Aplicação**
```bash
npm run start:dev
```

## 📝 Próximos Passos

1. **Implementar testes unitários** para cada módulo
2. **Adicionar documentação Swagger** para APIs
3. **Implementar middleware de autenticação**
4. **Configurar CI/CD** para deploy automático
5. **Adicionar logging estruturado**
6. **Implementar cache Redis** onde necessário

## 🤝 Contribuindo

Para adicionar um novo módulo:

1. Crie a pasta em `/src/modules/novo-modulo/`
2. Implemente o service, controller e DTOs
3. Crie o arquivo `novo-modulo.module.ts`
4. Adicione o módulo ao `app.module.ts`
5. Atualize este README

---

**Data da Reorganização**: 26 de Julho de 2025
**Versão**: 2.0.0
**Autor**: Sistema IGEMSTOCK
