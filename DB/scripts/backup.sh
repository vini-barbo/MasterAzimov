#!/bin/bash
# backup.sh - Script para backup manual do PostgreSQL

set -e

# Configurações
DB_HOST=${POSTGRES_HOST:-localhost}
DB_PORT=${POSTGRES_PORT:-5432}
DB_NAME=${POSTGRES_DB:-igem_stock}
DB_USER=${POSTGRES_USER:-postgres}
BACKUP_DIR="/var/lib/postgresql/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Criar diretório de backup se não existir
mkdir -p "$BACKUP_DIR"

echo "🔄 Iniciando backup do banco de dados..."
echo "📅 Data: $(date)"
echo "🏪 Banco: $DB_NAME"
echo "🔗 Host: $DB_HOST:$DB_PORT"

# Backup completo
BACKUP_FILE="$BACKUP_DIR/full_backup_${DB_NAME}_${DATE}.sql"
echo "💾 Criando backup completo em: $BACKUP_FILE"

pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
  --verbose \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  > "$BACKUP_FILE"

# Comprimir backup
echo "📦 Comprimindo backup..."
gzip "$BACKUP_FILE"
BACKUP_FILE="$BACKUP_FILE.gz"

# Verificar tamanho do backup
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "✅ Backup concluído!"
echo "📁 Arquivo: $BACKUP_FILE"
echo "📏 Tamanho: $BACKUP_SIZE"

# Backup apenas do schema (sem dados)
SCHEMA_FILE="$BACKUP_DIR/schema_${DB_NAME}_${DATE}.sql"
echo "🏗️ Criando backup do schema em: $SCHEMA_FILE"

pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
  --schema-only \
  --verbose \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  > "$SCHEMA_FILE"

gzip "$SCHEMA_FILE"

echo "✅ Backup do schema concluído!"

# Listar backups existentes
echo ""
echo "📋 Backups disponíveis:"
ls -lh "$BACKUP_DIR"/*.gz 2>/dev/null || echo "Nenhum backup encontrado"

echo ""
echo "🎉 Processo de backup finalizado com sucesso!"
