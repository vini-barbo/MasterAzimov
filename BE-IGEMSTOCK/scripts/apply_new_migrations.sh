#!/bin/bash

# Script para aplicar as migrações do sistema de pedidos e produção
# Autor: Sistema IGEMSTOCK
# Data: 26/07/2025

set -e

echo "🚀 Iniciando aplicação das migrações do sistema de pedidos e produção..."
echo "=================================================="

# Verificar se o Prisma está disponível
if ! command -v npx &> /dev/null; then
    echo "❌ NPX não encontrado. Instale o Node.js primeiro."
    exit 1
fi

# Função para aplicar uma migração
apply_migration() {
    local migration_path="$1"
    local migration_name="$2"
    
    echo "📦 Aplicando migração: $migration_name"
    echo "   Arquivo: $migration_path"
    
    if [ -f "$migration_path" ]; then
        npx prisma db execute --file "$migration_path"
        echo "✅ Migração $migration_name aplicada com sucesso!"
    else
        echo "❌ Arquivo de migração não encontrado: $migration_path"
        exit 1
    fi
    echo ""
}

# Diretório base das migrações
BASE_DIR="./prisma/migrations"

# Aplicar migrações em ordem
echo "1️⃣ Aplicando migração de fornecedores..."
apply_migration "$BASE_DIR/20250726190000_add_suppliers/migration.sql" "Fornecedores"

echo "2️⃣ Aplicando migração de pedidos de compra..."
apply_migration "$BASE_DIR/20250726191000_add_purchase_orders/migration.sql" "Pedidos de Compra"

echo "3️⃣ Aplicando migração de sistema de receitas..."
apply_migration "$BASE_DIR/20250726192000_add_recipes_system/migration.sql" "Sistema de Receitas"

echo "4️⃣ Aplicando migração de sistema de produção..."
apply_migration "$BASE_DIR/20250726193000_add_production_system/migration.sql" "Sistema de Produção"

echo "🔧 Gerando cliente Prisma atualizado..."
npx prisma generate
echo "✅ Cliente Prisma gerado com sucesso!"

echo ""
echo "🎉 Todas as migrações foram aplicadas com sucesso!"
echo "=================================================="
echo ""
echo "📋 Resumo das funcionalidades adicionadas:"
echo "   ✅ Cadastro de fornecedores"
echo "   ✅ Sistema de pedidos de compra"
echo "   ✅ Sistema de receitas de produção"
echo "   ✅ Controle de lotes de produção"
echo ""
echo "🔍 Para validar a instalação, execute:"
echo "   npx prisma studio"
echo ""
echo "📚 Consulte o README_NEW_MIGRATIONS.md para mais detalhes."
