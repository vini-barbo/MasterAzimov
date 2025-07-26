# 🌱 Seeds para Sistema de Pedidos e Produção - IGEMSTOCK

Este documento descreve os dados de exemplo (seeds) criados para as novas funcionalidades do sistema IGEMSTOCK.

## 📦 Dados Criados

### 🏪 Fornecedores (Suppliers)

| ID | Nome | Email | Telefone | Endereço |
|----|------|-------|----------|----------|
| 1 | Pharmex Distribuidora | vendas@pharmex.com.br | +55 11 99999-1234 | Rua das Indústrias, 123 - São Paulo, SP |
| 2 | MedSupply Ltda | contato@medsupply.com.br | +55 21 88888-5678 | Av. Central, 456 - Rio de Janeiro, RJ |
| 3 | BioFarma Suprimentos | compras@biofarma.com.br | +55 31 77777-9012 | Rua da Saúde, 789 - Belo Horizonte, MG |

### 📋 Pedidos de Compra (Purchase Orders)

| ID | Fornecedor | Data | Status | Total |
|----|------------|------|--------|-------|
| 1 | Pharmex Distribuidora | 2025-07-20 | PENDING | R$ 525,00 |
| 2 | MedSupply Ltda | 2025-07-18 | RECEIVED | R$ 312,50 |
| 3 | BioFarma Suprimentos | 2025-07-25 | PENDING | R$ 760,00 |

### 📝 Itens dos Pedidos

#### Pedido #1 (Pharmex)
- 25x Acetaminophen 500mg @ R$ 10,50 = R$ 262,50
- 30x Ibuprofen 200mg @ R$ 8,75 = R$ 262,50

#### Pedido #2 (MedSupply) - ✅ RECEBIDO
- 20x Vitamin C 1000mg @ R$ 15,25 = R$ 305,00

#### Pedido #3 (BioFarma)
- 40x Acetaminophen 500mg @ R$ 10,50 = R$ 420,00
- 25x Vitamin C 1000mg @ R$ 15,25 = R$ 381,25

### 🧪 Produtos Adicionais para Receitas

| SKU | Nome | Descrição | Custo Unitário |
|-----|------|-----------|----------------|
| PAIN-RELIEF-KIT | Kit Alívio da Dor | Kit completo para alívio da dor | R$ 35,00 |
| IMMUNITY-BOOSTER | Kit Reforço Imunológico | Kit para reforçar o sistema imunológico | R$ 28,00 |
| PACKAGING-BOX | Caixa de Embalagem | Caixa para embalagem de kits | R$ 2,50 |
| INFO-LEAFLET | Folheto Informativo | Folheto com informações do produto | R$ 0,50 |

### 🍔 Receitas (Recipes)

#### Receita #1: Kit Alívio da Dor
**Produto Final:** Kit Alívio da Dor (PAIN-RELIEF-KIT)

**Ingredientes por unidade:**
- 2x Acetaminophen 500mg
- 1x Ibuprofen 200mg  
- 1x Caixa de Embalagem
- 1x Folheto Informativo

#### Receita #2: Kit Reforço Imunológico  
**Produto Final:** Kit Reforço Imunológico (IMMUNITY-BOOSTER)

**Ingredientes por unidade:**
- 3x Vitamin C 1000mg
- 1x Caixa de Embalagem
- 1x Folheto Informativo

### 🏭 Lotes de Produção (Production Batches)

| ID | Receita | Quantidade | Data | Observações |
|----|---------|------------|------|-------------|
| 1 | Kit Alívio da Dor | 10 unidades | 2025-07-24 | Primeira produção do Kit Alívio da Dor |
| 2 | Kit Reforço Imunológico | 8 unidades | 2025-07-25 | Primeira produção do Kit Reforço Imunológico |

### 📦 Estoque Inicial de Ingredientes

| Produto | Warehouse | Quantidade | Observações |
|---------|-----------|------------|-------------|
| Caixa de Embalagem | Main Warehouse | 100 | Estoque inicial para embalagens |
| Folheto Informativo | Main Warehouse | 200 | Estoque inicial para folhetos |

## 🚀 Como Aplicar as Seeds

### Opção 1: Script Automatizado
```bash
cd BE-IGEMSTOCK
./scripts/setup_new_features.sh
```

### Opção 2: Comandos Manuais
```bash
cd BE-IGEMSTOCK

# Via Docker
make migrate-dev
make seed

# Ou localmente (se aplicável)
npx prisma migrate dev --name add_suppliers_purchase_orders_recipes_production
npx prisma generate
npx prisma db seed
```

## 🔍 Validação das Seeds

### Verificar Fornecedores
```bash
curl http://localhost:3000/api/suppliers
```

### Verificar Pedidos de Compra
```bash
curl http://localhost:3000/api/purchase-orders
```

### Verificar Receitas
```bash
curl http://localhost:3000/api/recipes
```

### Verificar Produtos
```bash
curl http://localhost:3000/api/products
```

## 📊 Fluxos de Teste Sugeridos

### 1. Fluxo de Pedido de Compra
1. ✅ Visualizar fornecedores cadastrados
2. ✅ Criar novo pedido para um fornecedor
3. ✅ Adicionar produtos ao pedido
4. ✅ Marcar pedido como "RECEBIDO"
5. ✅ Verificar movimentação automática no estoque

### 2. Fluxo de Produção
1. ✅ Visualizar receitas disponíveis
2. ✅ Verificar ingredientes em estoque
3. ✅ Executar produção (consumir ingredientes)
4. ✅ Verificar produto final adicionado ao estoque
5. ✅ Visualizar histórico de produção

### 3. Relatórios e Dashboard
1. ✅ Top produtos vendidos
2. ✅ Pedidos pendentes
3. ✅ Produções realizadas
4. ✅ Níveis de estoque por produto

## 🛡️ Características das Seeds

✅ **Dados Realísticos**: Nomes e informações baseados no mercado brasileiro  
✅ **Relacionamentos Complexos**: Testa todas as foreign keys e relacionamentos  
✅ **Diferentes Status**: Pedidos com status variados para teste  
✅ **Receitas Funcionais**: Receitas reais que podem ser produzidas  
✅ **Estoque Suficiente**: Quantidade adequada para testes de produção  
✅ **Tratamento de Erros**: Seeds funcionam mesmo se algumas tabelas não existirem  

## 📝 Observações Importantes

- As seeds são **idempotentes** - podem ser executadas múltiplas vezes
- Dados existentes são preservados (upsert quando possível)
- Logs detalhados mostram o progresso da criação
- Tratamento gracioso de erros se as tabelas não existirem ainda
- Seeds complementam os dados existentes sem sobrescrever

---

**Criado por**: Sistema IGEMSTOCK  
**Data**: 26 de Julho de 2025  
**Versão**: 1.0.0
