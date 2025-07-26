#!/bin/bash

# Script para aplicar migrações e seed para o sistema de pedidos e produção
# Autor: Sistema IGEMSTOCK
# Data: 26/07/2025

set -e

echo "🚀 Aplicando migrações e seed do sistema de pedidos e produção..."
echo "================================================================"

# Verificar se estamos no container ou localmente
if [[ -f /.dockerenv ]]; then
    echo "📦 Executando dentro do container Docker"
    PRISMA_CMD="npx prisma"
else
    echo "🐳 Executando via Docker Compose"
    PRISMA_CMD="docker compose -f compose.yaml exec backend npx prisma"
fi

echo ""
echo "1️⃣ Aplicando migrações do Prisma..."
$PRISMA_CMD migrate dev --name add_suppliers_purchase_orders_recipes_production

echo ""
echo "2️⃣ Gerando cliente Prisma..."
$PRISMA_CMD generate

echo ""
echo "3️⃣ Executando seed do banco de dados..."
$PRISMA_CMD db seed

echo ""
echo "✅ Processo concluído com sucesso!"
echo "================================================================"
echo ""
echo "📊 Dados de exemplo criados:"
echo "   ✅ 3 Fornecedores (Pharmex, MedSupply, BioFarma)"
echo "   ✅ 3 Pedidos de compra com diferentes status"
echo "   ✅ Itens dos pedidos vinculados aos produtos"
echo "   ✅ 2 Receitas (Kit Alívio da Dor, Kit Reforço Imunológico)"
echo "   ✅ Ingredientes para cada receita"
echo "   ✅ 2 Lotes de produção de exemplo"
echo "   ✅ Produtos adicionais (caixas, folhetos)"
echo ""
echo "🔍 Para visualizar os dados:"
echo "   $PRISMA_CMD studio"
echo ""
echo "🌐 Para testar a API:"
echo "   curl http://localhost:3000/api/suppliers"
echo "   curl http://localhost:3000/api/purchase-orders"
echo "   curl http://localhost:3000/api/recipes"
