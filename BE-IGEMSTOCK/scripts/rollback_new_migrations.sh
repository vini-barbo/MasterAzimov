#!/bin/bash

# Script para reverter as migrações do sistema de pedidos e produção
# Autor: Sistema IGEMSTOCK  
# Data: 26/07/2025
# ATENÇÃO: Este script remove dados! Use com cuidado!

set -e

echo "⚠️  ROLLBACK das migrações do sistema de pedidos e produção"
echo "=================================================="
echo "❌ ATENÇÃO: Este script irá REMOVER todas as tabelas e dados"
echo "   relacionados ao sistema de pedidos e produção!"
echo ""

read -p "Tem certeza que deseja continuar? (digite 'CONFIRMAR' para prosseguir): " confirmation

if [ "$confirmation" != "CONFIRMAR" ]; then
    echo "❌ Operação cancelada pelo usuário."
    exit 0
fi

echo ""
echo "🔄 Iniciando rollback das migrações..."

# Função para executar SQL de rollback
execute_rollback() {
    local sql_command="$1"
    local description="$2"
    
    echo "🗑️  $description"
    echo "   SQL: $sql_command"
    
    npx prisma db execute --stdin <<< "$sql_command"
    echo "✅ $description - concluído!"
    echo ""
}

# Rollback em ordem reversa (da última para a primeira migração)

echo "4️⃣ Removendo sistema de produção..."
execute_rollback "DROP TABLE IF EXISTS production_batches CASCADE;" "Removendo tabela production_batches"

echo "3️⃣ Removendo sistema de receitas..."
execute_rollback "DROP TABLE IF EXISTS recipe_ingredients CASCADE;" "Removendo tabela recipe_ingredients"
execute_rollback "DROP TABLE IF EXISTS recipes CASCADE;" "Removendo tabela recipes"

echo "2️⃣ Removendo sistema de pedidos de compra..."
execute_rollback "DROP TABLE IF EXISTS purchase_order_items CASCADE;" "Removendo tabela purchase_order_items"
execute_rollback "DROP TABLE IF EXISTS purchase_orders CASCADE;" "Removendo tabela purchase_orders"
execute_rollback "DROP TYPE IF EXISTS purchase_order_status CASCADE;" "Removendo enum purchase_order_status"

echo "1️⃣ Removendo fornecedores..."
execute_rollback "DROP TABLE IF EXISTS suppliers CASCADE;" "Removendo tabela suppliers"

echo "🔧 Gerando cliente Prisma atualizado..."
npx prisma generate
echo "✅ Cliente Prisma gerado com sucesso!"

echo ""
echo "✅ Rollback concluído com sucesso!"
echo "=================================================="
echo ""
echo "📋 Tabelas removidas:"
echo "   ❌ suppliers"
echo "   ❌ purchase_orders"
echo "   ❌ purchase_order_items"
echo "   ❌ recipes"
echo "   ❌ recipe_ingredients"
echo "   ❌ production_batches"
echo "   ❌ purchase_order_status (enum)"
echo ""
echo "⚠️  Lembre-se de atualizar o schema.prisma se necessário!"
