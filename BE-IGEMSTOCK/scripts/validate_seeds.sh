#!/bin/bash

# Script para validar se as seeds das novas funcionalidades foram aplicadas
# Autor: Sistema IGEMSTOCK
# Data: 26/07/2025

set -e

echo "🔍 Validando seeds do sistema de pedidos e produção..."
echo "====================================================="

# Verificar se estamos no container ou localmente
if [[ -f /.dockerenv ]]; then
    echo "📦 Executando dentro do container Docker"
    PRISMA_CMD="npx prisma"
    CURL_PREFIX=""
else
    echo "🐳 Executando via Docker Compose"
    PRISMA_CMD="docker compose -f compose.yaml exec backend npx prisma"
    CURL_PREFIX=""
fi

echo ""
echo "📊 Verificando dados no banco de dados..."

# Função para executar query SQL
run_query() {
    local query="$1"
    local description="$2"
    
    echo "  🔹 $description"
    if [[ -f /.dockerenv ]]; then
        psql -h database -U postgres -d igem_stock_dev -t -c "$query" 2>/dev/null || echo "    ❌ Erro ao executar query"
    else
        docker compose -f compose.yaml exec -T database psql -U postgres -d igem_stock_dev -t -c "$query" 2>/dev/null || echo "    ❌ Erro ao executar query"
    fi
}

echo ""
echo "1️⃣ Verificando fornecedores..."
run_query "SELECT COUNT(*) as total_suppliers FROM suppliers;" "Total de fornecedores"
run_query "SELECT name FROM suppliers ORDER BY name;" "Nomes dos fornecedores"

echo ""
echo "2️⃣ Verificando pedidos de compra..."
run_query "SELECT COUNT(*) as total_orders FROM purchase_orders;" "Total de pedidos"
run_query "SELECT status, COUNT(*) FROM purchase_orders GROUP BY status;" "Pedidos por status"

echo ""
echo "3️⃣ Verificando itens de pedidos..."
run_query "SELECT COUNT(*) as total_items FROM purchase_order_items;" "Total de itens em pedidos"

echo ""
echo "4️⃣ Verificando receitas..."
run_query "SELECT COUNT(*) as total_recipes FROM recipes;" "Total de receitas"
run_query "SELECT r.name FROM recipes r ORDER BY r.name;" "Nomes das receitas"

echo ""
echo "5️⃣ Verificando ingredientes de receitas..."
run_query "SELECT COUNT(*) as total_ingredients FROM recipe_ingredients;" "Total de ingredientes em receitas"

echo ""
echo "6️⃣ Verificando lotes de produção..."
run_query "SELECT COUNT(*) as total_batches FROM production_batches;" "Total de lotes produzidos"
run_query "SELECT quantity_produced, production_date FROM production_batches ORDER BY production_date;" "Produções realizadas"

echo ""
echo "7️⃣ Verificando produtos adicionais..."
run_query "SELECT COUNT(*) FROM products WHERE sku LIKE '%KIT%' OR sku LIKE '%PACKAGING%' OR sku LIKE '%LEAFLET%';" "Produtos para receitas"

echo ""
echo "🌐 Testando endpoints da API (se o servidor estiver rodando)..."

test_endpoint() {
    local endpoint="$1"
    local description="$2"
    
    echo "  🔹 Testando $description"
    response=$(curl -s -w "%{http_code}" -o /dev/null "http://localhost:3000$endpoint" 2>/dev/null || echo "000")
    
    if [ "$response" = "200" ]; then
        echo "    ✅ Endpoint funcionando ($endpoint)"
    elif [ "$response" = "000" ]; then
        echo "    ⚠️  Servidor não está rodando ou endpoint não disponível"
    else
        echo "    ❌ Erro HTTP $response ($endpoint)"
    fi
}

test_endpoint "/health" "Health check"
test_endpoint "/api/suppliers" "Endpoint de fornecedores"
test_endpoint "/api/purchase-orders" "Endpoint de pedidos"
test_endpoint "/api/recipes" "Endpoint de receitas"
test_endpoint "/api/products" "Endpoint de produtos"

echo ""
echo "🧪 Resumo dos testes:"
echo "=================================================="

# Contadores para o resumo
suppliers_count=$(docker compose -f compose.yaml exec -T database psql -U postgres -d igem_stock_dev -t -c "SELECT COUNT(*) FROM suppliers;" 2>/dev/null | tr -d ' ' || echo "0")
orders_count=$(docker compose -f compose.yaml exec -T database psql -U postgres -d igem_stock_dev -t -c "SELECT COUNT(*) FROM purchase_orders;" 2>/dev/null | tr -d ' ' || echo "0")
recipes_count=$(docker compose -f compose.yaml exec -T database psql -U postgres -d igem_stock_dev -t -c "SELECT COUNT(*) FROM recipes;" 2>/dev/null | tr -d ' ' || echo "0")
batches_count=$(docker compose -f compose.yaml exec -T database psql -U postgres -d igem_stock_dev -t -c "SELECT COUNT(*) FROM production_batches;" 2>/dev/null | tr -d ' ' || echo "0")

echo "📊 Dados encontrados:"
echo "   Fornecedores: $suppliers_count (esperado: 3)"
echo "   Pedidos: $orders_count (esperado: 3)"
echo "   Receitas: $recipes_count (esperado: 2)"
echo "   Lotes de produção: $batches_count (esperado: 2)"

echo ""
if [ "$suppliers_count" -ge "3" ] && [ "$orders_count" -ge "3" ] && [ "$recipes_count" -ge "2" ] && [ "$batches_count" -ge "2" ]; then
    echo "✅ Validação APROVADA - Seeds aplicadas corretamente!"
else
    echo "⚠️  Validação PARCIAL - Algumas seeds podem não ter sido aplicadas"
    echo "💡 Execute: ./scripts/setup_new_features.sh"
fi

echo ""
echo "🔧 Comandos úteis para investigação:"
echo "   make psql                          # Acessar banco diretamente"
echo "   make studio                        # Abrir Prisma Studio"
echo "   curl http://localhost:3000/api/*   # Testar endpoints"
echo "   make logs-backend                  # Ver logs da aplicação"
