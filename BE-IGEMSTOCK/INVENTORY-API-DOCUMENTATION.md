# Sistema de Controle de Estoque - API Documentation

Este sistema implementa um controle completo de estoque com notificações e dashboard, baseado no esquema de banco de dados fornecido.

## 📋 Módulos Implementados

### 1. **Inventory Service** 
Controle completo de produtos, almoxarifados, lotes e movimentações de estoque.

### 2. **Notification Service**
Sistema de notificações automáticas para estoque baixo e produtos próximos do vencimento.

### 3. **Dashboard Service**
Relatórios de vendas e produtos mais vendidos.

## 🚀 APIs Disponíveis

### **Products (Produtos)**
- `GET /products` - Lista todos os produtos
- `GET /products/:id` - Busca produto por ID
- `GET /products/sku/:sku` - Busca produto por SKU
- `GET /products/:id/stock` - Níveis de estoque do produto
- `POST /products` - Cria novo produto
- `PATCH /products/:id` - Atualiza produto
- `DELETE /products/:id` - Remove produto

### **Warehouses (Almoxarifados)**
- `GET /warehouses` - Lista todos os almoxarifados
- `GET /warehouses/:id` - Busca almoxarifado por ID
- `GET /warehouses/:id/stock` - Níveis de estoque no almoxarifado
- `POST /warehouses` - Cria novo almoxarifado
- `PATCH /warehouses/:id` - Atualiza almoxarifado
- `DELETE /warehouses/:id` - Remove almoxarifado

### **Batches (Lotes)**
- `GET /batches` - Lista todos os lotes
- `GET /batches/:id` - Busca lote por ID
- `GET /batches/expiring?days=30` - Lotes próximos do vencimento
- `GET /batches/product/:productId` - Lotes por produto
- `GET /batches/warehouse/:warehouseId` - Lotes por almoxarifado
- `POST /batches` - Cria novo lote
- `PATCH /batches/:id` - Atualiza lote
- `DELETE /batches/:id` - Remove lote

### **Stock Movements (Movimentações)**
- `GET /stock-movements` - Lista todas as movimentações
- `GET /stock-movements/:id` - Busca movimentação por ID
- `GET /stock-movements/stock-on-hand` - Estoque atual consolidado
- `GET /stock-movements/product/:productId` - Movimentações por produto
- `GET /stock-movements/warehouse/:warehouseId` - Movimentações por almoxarifado
- `GET /stock-movements/batch/:batchId` - Movimentações por lote
- `POST /stock-movements` - Cria nova movimentação

### **Notification Rules (Regras de Notificação)**
- `GET /notification-rules` - Lista todas as regras
- `GET /notification-rules/:id` - Busca regra por ID
- `GET /notification-rules?type=LOW_STOCK` - Filtrar por tipo
- `GET /notification-rules/alerts/low-stock` - Verifica alertas de estoque baixo
- `GET /notification-rules/alerts/expiry` - Verifica alertas de vencimento
- `POST /notification-rules` - Cria nova regra
- `PATCH /notification-rules/:id` - Atualiza regra
- `DELETE /notification-rules/:id` - Remove regra

### **Notification Logs (Histórico de Notificações)**
- `GET /notification-logs` - Lista todos os logs
- `GET /notification-logs?status=PENDING` - Filtrar por status
- `GET /notification-logs/rule/:ruleId` - Logs por regra

### **Sales (Vendas)**
- `GET /sales` - Lista todas as vendas
- `GET /sales/:id` - Busca venda por ID
- `GET /sales?startDate=2024-01-01&endDate=2024-12-31` - Filtrar por período
- `GET /sales/summary` - Resumo de vendas
- `GET /sales/summary?startDate=2024-01-01&endDate=2024-12-31` - Resumo por período
- `POST /sales` - Cria nova venda
- `DELETE /sales/:id` - Remove venda

### **Sale Items (Itens de Venda)**
- `GET /sale-items` - Lista todos os itens de venda
- `GET /sale-items/:id` - Busca item por ID
- `GET /sale-items/top-selling?limit=10` - Produtos mais vendidos
- `GET /sale-items/top-selling?startDate=2024-01-01&endDate=2024-12-31` - Top vendidos por período
- `GET /sale-items/sale/:saleId` - Itens por venda
- `GET /sale-items/product/:productId` - Itens por produto
- `POST /sale-items` - Cria novo item de venda
- `DELETE /sale-items/:id` - Remove item de venda

## 📊 Views e Relatórios Implementados

### **Stock On Hand**
A view `vw_stock_on_hand` é implementada através da API:
```
GET /stock-movements/stock-on-hand
```
Retorna o estoque atual por produto e almoxarifado.

### **Top Selling Products**
A view `vw_top_selling_products` é implementada através da API:
```
GET /sale-items/top-selling
```
Retorna os produtos mais vendidos com total de unidades e receita.

## 🔔 Sistema de Notificações

### Tipos de Regras
1. **LOW_STOCK**: Alerta quando estoque fica abaixo do limite
2. **EXPIRY**: Alerta quando produtos estão próximos do vencimento

### Status de Notificação
- **PENDING**: Notificação pendente de envio
- **SENT**: Notificação enviada com sucesso
- **FAILED**: Falha no envio da notificação

### Canais de Notificação
- **EMAIL**: Notificação por email
- **SMS**: Notificação por SMS
- **PUSH**: Notificação push

## 🗃️ Modelo de Dados

### Relacionamentos Principais
- `Product` ↔ `Batch` (1:N)
- `Warehouse` ↔ `Batch` (1:N)
- `Product` ↔ `StockMovement` (1:N)
- `Warehouse` ↔ `StockMovement` (1:N)
- `Batch` ↔ `StockMovement` (1:N) - opcional
- `Sale` ↔ `SaleItem` (1:N)
- `Product` ↔ `SaleItem` (1:N)

### Tipos de Movimentação
- **IN**: Entrada de estoque
- **OUT**: Saída de estoque
- **ADJ**: Ajuste de estoque

## 🛠️ Como Usar

### 1. Executar Migrações
```bash
cd BE-IGEMSTOCK
npx prisma migrate dev
npx prisma generate
```

### 2. Popular Banco com Dados de Exemplo
```bash
npx prisma db seed
```

### 3. Iniciar Servidor
```bash
npm run start:dev
```

### 4. Acessar Documentação Swagger
```
http://localhost:3000/api
```

## 📈 Casos de Uso Comuns

### Registrar Entrada de Estoque
```bash
# 1. Criar movimentação de entrada
POST /stock-movements
{
  "productId": 1,
  "warehouseId": 1,
  "batchId": 1,
  "movementType": "IN",
  "quantity": 100,
  "notes": "Recebimento do fornecedor"
}
```

### Registrar Venda
```bash
# 1. Criar venda
POST /sales
{
  "saleDate": "2024-01-15T10:30:00Z",
  "totalAmount": 150.75
}

# 2. Adicionar itens à venda
POST /sale-items
{
  "saleId": 1,
  "productId": 1,
  "quantity": 5,
  "unitPrice": 25.50
}

# 3. Registrar saída do estoque
POST /stock-movements
{
  "productId": 1,
  "warehouseId": 1,
  "movementType": "OUT",
  "quantity": 5,
  "relatedId": 1,
  "notes": "Venda"
}
```

### Configurar Alertas
```bash
# Alerta de estoque baixo
POST /notification-rules
{
  "ruleType": "LOW_STOCK",
  "threshold": 10
}

# Alerta de vencimento
POST /notification-rules
{
  "ruleType": "EXPIRY",
  "daysBeforeExpiry": 30
}
```

### Verificar Alertas
```bash
# Verificar estoque baixo
GET /notification-rules/alerts/low-stock

# Verificar produtos vencendo
GET /notification-rules/alerts/expiry
```

## 🔍 Consultas Úteis

### Estoque Atual por Produto
```bash
GET /products/1/stock
```

### Produtos Mais Vendidos (Últimos 30 dias)
```bash
GET /sale-items/top-selling?startDate=2024-01-01&endDate=2024-01-31&limit=10
```

### Lotes Vencendo nos Próximos 15 dias
```bash
GET /batches/expiring?days=15
```

### Resumo de Vendas do Mês
```bash
GET /sales/summary?startDate=2024-01-01&endDate=2024-01-31
```

## ⚠️ Observações Importantes

1. **Compatibilidade**: O sistema mantém os modelos legados (`StockItem`, `LegacyStockMovement`) para compatibilidade com versões anteriores.

2. **Transações**: Para operações críticas como vendas, considere implementar transações para garantir consistência.

3. **Validações**: Todas as APIs incluem validações de entrada usando class-validator.

4. **Documentação**: Todas as rotas estão documentadas com Swagger/OpenAPI.

5. **Auditoria**: O sistema inclui campos de auditoria e logs para rastreabilidade.

## 🔧 Próximos Passos

- [ ] Implementar autenticação JWT
- [ ] Adicionar middleware de auditoria automática
- [ ] Implementar sistema de envio real de notificações
- [ ] Adicionar testes unitários e de integração
- [ ] Implementar caching com Redis
- [ ] Adicionar rate limiting
- [ ] Implementar relatórios em PDF/Excel
