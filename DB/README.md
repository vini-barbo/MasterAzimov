# PostgreSQL Docker Setup - IGEM Stock

Este diretório contém a configuração completa do PostgreSQL para a aplicação IGEM Stock.

## 📁 Estrutura de Arquivos

```
DB/
├── Dockerfile                  # Build customizado do PostgreSQL
├── docker-compose.yml        # Orquestração dos serviços
├── .env.db                   # Variáveis de ambiente
├── postgresql.conf           # Configuração do PostgreSQL
├── pg_hba.conf              # Configuração de autenticação
├── init-scripts/            # Scripts de inicialização
│   ├── 01-init-database.sql  # Criação do banco e extensões
│   ├── 02-create-users.sql   # Usuários e permissões
│   └── 03-audit-setup.sql    # Sistema de auditoria
├── scripts/                 # Scripts de manutenção
│   ├── backup.sh           # Backup manual
│   ├── restore.sh          # Restauração
│   └── maintenance.sh      # Manutenção e otimização
├── pgadmin/                # Configuração do pgAdmin
│   └── servers.json        # Servidores pré-configurados
└── README.md              # Esta documentação
```

## 🚀 Início Rápido

### 1. Configurar Variáveis de Ambiente
```bash
# Copiar arquivo de exemplo
cp .env.db .env

# Editar as senhas (IMPORTANTE!)
nano .env
```

### 2. Iniciar os Serviços
```bash
# Build e start
docker-compose up --build -d

# Verificar status
docker-compose ps
```

### 3. Acessar Serviços
- **PostgreSQL**: `localhost:5432`
- **pgAdmin**: http://localhost:5050 (admin@igem.com / admin123)

## 🔐 Usuários e Permissões

### Usuários Criados Automaticamente:
1. **postgres** - Superusuário administrativo
2. **igem_app** - Usuário da aplicação (leitura/escrita)
3. **igem_readonly** - Usuário apenas leitura

### URLs de Conexão:
```bash
# Aplicação
DATABASE_URL=postgresql://igem_app:app_password@localhost:5432/igem_stock

# Administração
DATABASE_ADMIN_URL=postgresql://postgres:postgres_password@localhost:5432/igem_stock

# Somente leitura
DATABASE_READONLY_URL=postgresql://igem_readonly:readonly_password@localhost:5432/igem_stock
```

## 🛠️ Scripts de Manutenção

### Backup Manual
```bash
# Entrar no container
docker-compose exec postgres bash

# Executar backup
/scripts/backup.sh
```

### Restauração
```bash
# Restaurar backup específico
docker-compose exec postgres /scripts/restore.sh /var/lib/postgresql/backups/backup_file.sql.gz
```

### Manutenção e Otimização
```bash
# Executar manutenção completa
docker-compose exec postgres /scripts/maintenance.sh
```

## 📊 Monitoramento

### Health Check
```bash
# Verificar saúde do container
docker-compose ps
docker-compose logs postgres
```

### Estatísticas do Banco
```bash
# Conectar e executar função de estatísticas
docker-compose exec postgres psql -U postgres -d igem_stock -c "SELECT * FROM database_stats();"
```

### Conexões Ativas
```bash
docker-compose exec postgres psql -U postgres -d igem_stock -c "
SELECT pid, usename, application_name, client_addr, state, query_start 
FROM pg_stat_activity 
WHERE datname = 'igem_stock';"
```

## 🔧 Configurações Importantes

### Performance
- **shared_buffers**: 256MB
- **effective_cache_size**: 1GB
- **max_connections**: 100
- **maintenance_work_mem**: 64MB

### Logging
- **log_min_duration_statement**: 1000ms
- **log_statement**: mod (modificações)
- **Timezone**: America/Sao_Paulo

### Extensões Instaladas
- `uuid-ossp` - Geração de UUIDs
- `pg_stat_statements` - Estatísticas de queries
- `pg_trgm` - Busca por similaridade
- `unaccent` - Remoção de acentos

## 🔄 Backup Automático

O container `postgres-backup` executa backups diários:
- **Horário**: Todo dia às 2h (configurável)
- **Retenção**: 30 dias (configurável)
- **Local**: Volume `postgres_backups`

### Configurar Backup Customizado
```bash
# Editar crontab no container de backup
docker-compose exec postgres-backup crontab -e
```

## 🚨 Sistema de Auditoria

### Tabela de Auditoria
```sql
-- Ver logs de auditoria
SELECT * FROM audit.audit_log ORDER BY changed_at DESC LIMIT 10;

-- Limpar logs antigos (90+ dias)
SELECT audit.cleanup_old_audit_logs(90);
```

### Adicionar Auditoria a uma Tabela
```sql
-- Exemplo para tabela 'users'
CREATE TRIGGER audit_users_trigger
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit.audit_trigger();
```

## 📈 Performance Tuning

### Verificar Queries Lentas
```sql
-- Top 10 queries mais lentas
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY total_time DESC 
LIMIT 10;
```

### Índices Não Utilizados
```sql
-- Encontrar índices sem uso
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes 
WHERE idx_scan = 0;
```

## 🔒 Segurança

### Mudança de Senhas
```bash
# Conectar como superusuário
docker-compose exec postgres psql -U postgres

# Alterar senha do usuário da aplicação
ALTER USER igem_app PASSWORD 'nova_senha_segura';
```

### SSL (Produção)
Para produção, edite `postgresql.conf`:
```
ssl = on
ssl_cert_file = '/etc/ssl/certs/postgresql.crt'
ssl_key_file = '/etc/ssl/private/postgresql.key'
```

## 🔍 Troubleshooting

### Container não inicia
```bash
# Ver logs detalhados
docker-compose logs postgres

# Verificar configurações
docker-compose config
```

### Problemas de conexão
```bash
# Testar conexão
docker-compose exec postgres pg_isready -U postgres

# Verificar configuração de rede
docker network ls
docker network inspect db_postgres_network
```

### Banco corrompido
```bash
# Verificar integridade
docker-compose exec postgres pg_dumpall -U postgres > backup_completo.sql

# Recriar banco se necessário
docker-compose down -v
docker-compose up --build
```

## 📝 Variáveis de Ambiente

### Obrigatórias
- `POSTGRES_DB` - Nome do banco
- `POSTGRES_USER` - Usuário administrador
- `POSTGRES_PASSWORD` - Senha do administrador

### Opcionais
- `POSTGRES_TIMEZONE` - Fuso horário (padrão: America/Sao_Paulo)
- `POSTGRES_BACKUP_RETENTION_DAYS` - Retenção de backups (padrão: 30)
- `POSTGRES_MAX_CONNECTIONS` - Máximo de conexões (padrão: 100)

## 📚 Comandos Úteis

```bash
# Parar serviços
docker-compose down

# Parar e remover dados
docker-compose down -v

# Ver uso de espaço
docker system df

# Backup manual rápido
docker-compose exec postgres pg_dump -U postgres igem_stock > backup.sql

# Importar dados
docker-compose exec -T postgres psql -U postgres igem_stock < backup.sql

# Acessar psql
docker-compose exec postgres psql -U postgres -d igem_stock
```
