#!/bin/bash
# restore.sh - Script para restaurar backup do PostgreSQL

set -e

# Configurações
DB_HOST=${POSTGRES_HOST:-localhost}
DB_PORT=${POSTGRES_PORT:-5432}
DB_NAME=${POSTGRES_DB:-igem_stock}
DB_USER=${POSTGRES_USER:-postgres}
BACKUP_DIR="/var/lib/postgresql/backups"

# Verificar se o arquivo de backup foi fornecido
if [ -z "$1" ]; then
    echo "❌ Erro: Arquivo de backup não especificado"
    echo "📋 Uso: $0 <arquivo_backup>"
    echo ""
    echo "📁 Backups disponíveis:"
    ls -1 "$BACKUP_DIR"/*.gz 2>/dev/null | head -10
    exit 1
fi

BACKUP_FILE="$1"

# Verificar se o arquivo existe
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Erro: Arquivo de backup não encontrado: $BACKUP_FILE"
    exit 1
fi

echo "🔄 Iniciando restauração do banco de dados..."
echo "📅 Data: $(date)"
echo "🏪 Banco: $DB_NAME"
echo "🔗 Host: $DB_HOST:$DB_PORT"
echo "📁 Backup: $BACKUP_FILE"

# Confirmar restauração
read -p "⚠️  ATENÇÃO: Esta operação irá SOBRESCREVER o banco '$DB_NAME'. Continuar? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operação cancelada pelo usuário"
    exit 1
fi

# Descomprimir se necessário
TEMP_FILE=""
if [[ "$BACKUP_FILE" == *.gz ]]; then
    echo "📦 Descomprimindo arquivo..."
    TEMP_FILE="/tmp/restore_$(basename "$BACKUP_FILE" .gz)"
    gunzip -c "$BACKUP_FILE" > "$TEMP_FILE"
    BACKUP_FILE="$TEMP_FILE"
fi

# Restaurar banco
echo "🔄 Restaurando banco de dados..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" < "$BACKUP_FILE"

# Limpar arquivo temporário
if [ -n "$TEMP_FILE" ] && [ -f "$TEMP_FILE" ]; then
    rm "$TEMP_FILE"
    echo "🧹 Arquivo temporário removido"
fi

echo "✅ Restauração concluída com sucesso!"
echo "🎉 Banco de dados '$DB_NAME' foi restaurado"

# Verificar conexão
echo "🔍 Verificando conexão com o banco..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT version();" > /dev/null

echo "✅ Conexão verificada com sucesso!"
