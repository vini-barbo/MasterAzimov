#!/bin/bash
# maintenance.sh - Script para manutenção do PostgreSQL

set -e

# Configurações
DB_HOST=${POSTGRES_HOST:-localhost}
DB_PORT=${POSTGRES_PORT:-5432}
DB_NAME=${POSTGRES_DB:-igem_stock}
DB_USER=${POSTGRES_USER:-postgres}

echo "🔧 Iniciando manutenção do banco de dados..."
echo "📅 Data: $(date)"
echo "🏪 Banco: $DB_NAME"

# Função para executar SQL
execute_sql() {
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "$1"
}

# Verificar status do banco
echo "📊 Status do banco de dados:"
execute_sql "SELECT 
    pg_database.datname as database_name,
    pg_size_pretty(pg_database_size(pg_database.datname)) as size,
    (SELECT count(*) FROM pg_stat_activity WHERE pg_stat_activity.datname = pg_database.datname) as connections
FROM pg_database 
WHERE datname = '$DB_NAME';"

echo ""
echo "📈 Estatísticas das tabelas:"
execute_sql "SELECT 
    schemaname,
    tablename,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    n_live_tup as live_rows,
    n_dead_tup as dead_rows,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables 
ORDER BY n_live_tup DESC;"

echo ""
echo "🧹 Executando VACUUM e ANALYZE nas tabelas..."

# VACUUM ANALYZE em todas as tabelas do usuário
for table in $(execute_sql "SELECT tablename FROM pg_tables WHERE schemaname = 'public';" -t -A); do
    if [ -n "$table" ] && [ "$table" != "tablename" ]; then
        echo "🔄 Processando tabela: $table"
        execute_sql "VACUUM ANALYZE public.$table;"
    fi
done

echo ""
echo "📊 Índices não utilizados:"
execute_sql "SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes 
WHERE idx_scan = 0 
ORDER BY pg_relation_size(indexrelid) DESC;"

echo ""
echo "📊 Tamanho das tabelas:"
execute_sql "SELECT 
    schemaname||'.'||tablename as table_name,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) as index_size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"

echo ""
echo "🔍 Conexões ativas:"
execute_sql "SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    state,
    query_start,
    LEFT(query, 50) as query_preview
FROM pg_stat_activity 
WHERE datname = '$DB_NAME' AND state = 'active';"

echo ""
echo "📈 Estatísticas de performance:"
execute_sql "SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements 
ORDER BY total_time DESC 
LIMIT 10;" 2>/dev/null || echo "pg_stat_statements não disponível"

echo ""
echo "🧹 Limpando logs de auditoria antigos (90+ dias)..."
execute_sql "SELECT audit.cleanup_old_audit_logs(90);" 2>/dev/null || echo "Função de limpeza de auditoria não disponível"

echo ""
echo "✅ Manutenção concluída!"
echo "🎉 Banco de dados otimizado e analisado"
