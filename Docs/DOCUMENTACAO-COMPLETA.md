# 📚 Documentação Completa - Master Azimov

## 🎯 Visão Geral do Projeto

O **Master Azimov** é um sistema completo de gestão de estoque desenvolvido com arquitetura moderna e stack de monitoramento avançada. Este documento consolida toda a documentação técnica e operacional do projeto.

### 🏗️ Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                    MASTER AZIMOV ARCHITECTURE                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ Frontend    │    │ Backend     │    │ Database    │         │
│  │ (Next.js)   │───▶│ (NestJS)    │───▶│ PostgreSQL  │         │
│  │             │    │ TypeScript  │    │ + Prisma    │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                              │                                  │
│                              ▼                                  │
│                     ┌─────────────┐                             │
│                     │   Redis     │                             │
│                     │   Cache     │                             │
│                     └─────────────┘                             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              MONITORING STACK                           │   │
│  │                                                         │   │
│  │ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌─────────┐ │   │
│  │ │Prometheus │ │ Grafana   │ │   ELK     │ │ Jaeger  │ │   │
│  │ │ Metrics   │ │Dashboard  │ │ Logging   │ │ Tracing │ │   │
│  │ └───────────┘ └───────────┘ └───────────┘ └─────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    INFRASTRUCTURE                       │   │
│  │                                                         │   │
│  │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐   │   │
│  │ │ Docker  │ │ Nginx   │ │ Alerts  │ │   Backup    │   │   │
│  │ │Compose  │ │Reverse  │ │Manager  │ │  Scripts    │   │   │
│  │ │         │ │ Proxy   │ │         │ │             │   │   │
│  │ └─────────┘ └─────────┘ └─────────┘ └─────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Estrutura Detalhada do Projeto

```
Master-Azimov/
├── 🏗️  INFRAESTRUTURA
│   ├── compose.yaml              # Docker Compose desenvolvimento
│   ├── compose.prod.yaml         # Docker Compose produção
│   ├── manage.sh                 # Script principal de gerenciamento
│   ├── docker-manager.sh         # Gerenciador Docker avançado
│   └── Makefile                  # Automação de tarefas
│
├── 🎯  BACKEND (BE-IGEMSTOCK/)
│   ├── 📂 src/                   # Código fonte principal
│   │   ├── modules/              # Módulos da aplicação
│   │   ├── config/               # Configurações
│   │   ├── database/             # Configuração do banco
│   │   ├── shared/               # Recursos compartilhados
│   │   └── main.ts               # Ponto de entrada
│   ├── 📂 prisma/                # ORM e banco de dados
│   │   ├── schema.prisma         # Schema do banco
│   │   ├── seed.ts               # Dados iniciais
│   │   └── migrations/           # Migrações
│   ├── 📂 test/                  # Testes
│   ├── 📂 scripts/               # Scripts de manutenção
│   ├── Dockerfile.dev            # Imagem desenvolvimento
│   ├── Dockerfile.prod           # Imagem produção
│   └── package.json              # Dependências Node.js
│
├── 🗄️  DATABASE (DB/)
│   ├── 📂 init-scripts/          # Scripts de inicialização
│   │   ├── 01-init-database.sql  # Criação inicial
│   │   ├── 02-create-users.sql   # Usuários
│   │   └── 03-audit-setup.sql    # Auditoria
│   ├── 📂 scripts/               # Scripts de manutenção
│   │   ├── backup.sh             # Backup automático
│   │   ├── maintenance.sh        # Manutenção
│   │   └── restore.sh            # Restauração
│   ├── 📂 pgadmin/               # Interface web
│   ├── postgresql.conf           # Configuração PostgreSQL
│   └── Dockerfile                # Imagem customizada
│
├── ⚡  CACHE (CA/)
│   ├── 📂 config/                # Configurações Redis
│   │   ├── redis.conf            # Desenvolvimento
│   │   ├── redis.prod.conf       # Produção
│   │   └── redis.test.conf       # Testes
│   ├── 📂 scripts/               # Scripts Redis
│   │   ├── backup.sh             # Backup Redis
│   │   ├── monitor.sh            # Monitoramento
│   │   └── healthcheck.sh        # Health check
│   ├── Dockerfile                # Desenvolvimento
│   └── Dockerfile.prod           # Produção
│
├── 📊  MONITORING (Monitor/)
│   ├── 📂 prometheus/            # Coleta de métricas
│   │   ├── prometheus.yml        # Configuração principal
│   │   └── rules/                # Regras de alerta
│   ├── 📂 grafana/               # Dashboards
│   │   ├── provisioning/         # Configuração automática
│   │   └── dashboards/           # Dashboards JSON
│   ├── 📂 logstash/              # Processamento logs
│   │   ├── config/               # Configurações
│   │   └── pipeline/             # Pipelines
│   ├── 📂 filebeat/              # Coleta de logs
│   ├── 📂 alertmanager/          # Gerenciamento alertas
│   ├── 📂 scripts/               # Scripts de gerenciamento
│   │   ├── setup.sh              # Setup inicial
│   │   ├── health-check.sh       # Verificações
│   │   └── backup-logs.sh        # Backup logs
│   └── docker-compose.yml        # Monitoramento standalone
│
├── 🌐  FRONTEND (FE/)
│   ├── 📂 app/                   # Aplicação Next.js
│   ├── 📂 components/            # Componentes React
│   ├── 📂 hooks/                 # Hooks customizados
│   ├── 📂 lib/                   # Bibliotecas
│   ├── package.json              # Dependências
│   └── next.config.mjs           # Configuração Next.js
│
├── 🔄  PROXY (nginx/)
│   ├── nginx.conf                # Configuração Nginx
│   └── ssl/                      # Certificados SSL
│
└── 📚  DOCUMENTAÇÃO (Docs/)
    ├── README.md                 # Índice principal
    ├── DOCKER-README.md          # Guia Docker
    ├── MONITORAMENTO.md          # Guia monitoramento
    ├── GUIA-RAPIDO.md            # Referência rápida
    └── [módulos]/                # Docs específicas
```

## 🚀 Ambientes e Configurações

### 🔧 Ambiente de Desenvolvimento

**Características:**
- Hot reload no backend
- Banco PostgreSQL local
- Redis com configurações básicas
- Monitoramento opcional
- Logs detalhados

**Serviços Essenciais:**
```yaml
Porta  | Serviço      | URL                    | Credenciais
-------|------------- |------------------------|------------------
3000   | Backend API  | http://localhost:3000  | -
5432   | PostgreSQL   | localhost:5432         | postgres/postgres123
6379   | Redis        | localhost:6379         | -
5050   | pgAdmin      | http://localhost:5050  | admin@igemstock.com/admin123
8001   | RedisInsight | http://localhost:8001  | -
```

**Comandos Principais:**
```bash
# Iniciar desenvolvimento básico
./manage.sh dev

# Desenvolvimento com monitoramento completo
./manage.sh dev-full

# Parar ambiente
./manage.sh stop-dev

# Ver logs específicos
./manage.sh logs-dev backend
```

### 🏭 Ambiente de Produção

**Características:**
- Imagens otimizadas multi-stage
- Configurações de segurança
- Stack completa de monitoramento
- Backup automatizado
- Health checks avançados
- Limites de recursos

**Stack Completa:**
```yaml
Porta  | Serviço        | URL                      | Função
-------|----------------|--------------------------|------------------
3000   | Backend        | http://localhost:3000    | API Principal
5432   | PostgreSQL     | localhost:5432           | Banco de dados
6379   | Redis          | localhost:6379           | Cache/Sessões
80/443 | Nginx          | http://localhost         | Proxy reverso
3030   | Grafana        | http://localhost:3030    | Dashboards
9090   | Prometheus     | http://localhost:9090    | Métricas
5601   | Kibana         | http://localhost:5601    | Logs
9200   | Elasticsearch  | http://localhost:9200    | Armazenamento logs
9093   | AlertManager   | http://localhost:9093    | Alertas
16686  | Jaeger         | http://localhost:16686   | Tracing
9100   | Node Exporter  | http://localhost:9100    | Métricas sistema
8080   | cAdvisor       | http://localhost:8080    | Métricas containers
```

**Configurações Críticas:**
```bash
# Variáveis obrigatórias no .env
POSTGRES_PASSWORD=senha_super_segura_aqui
JWT_SECRET=chave_jwt_muito_forte_32_chars_minimo
GRAFANA_ADMIN_PASSWORD=senha_grafana_forte
REDIS_PASSWORD=senha_redis_forte
GRAFANA_SECRET_KEY=chave_secreta_grafana_32_chars
```

**Comandos de Produção:**
```bash
# Iniciar produção
./manage.sh prod

# Parar produção
./manage.sh stop-prod

# Health check completo
./manage.sh health

# Backup completo
./manage.sh backup

# Logs específicos
./manage.sh logs-prod grafana
```

## 🔍 Sistema de Monitoramento

### 📈 Prometheus - Coleta de Métricas

**Configuração:** `Monitor/prometheus/prometheus.yml`

**Targets Monitorados:**
- Backend NestJS (métricas aplicação)
- PostgreSQL (performance banco)
- Redis (cache e performance)
- Node Exporter (métricas sistema)
- cAdvisor (métricas containers)

**Métricas Principais:**
```yaml
# Aplicação
- http_requests_total
- http_request_duration_seconds
- nodejs_heap_size_used_bytes
- active_connections

# Banco de dados
- pg_up
- pg_stat_database_numbackends
- pg_stat_database_xact_commit
- pg_locks_count

# Redis
- redis_connected_clients
- redis_used_memory_bytes
- redis_keyspace_hits_total
- redis_commands_processed_total

# Sistema
- node_cpu_seconds_total
- node_memory_MemAvailable_bytes
- node_filesystem_size_bytes
- node_load1
```

### 📊 Grafana - Visualização

**Dashboards Principais:**

1. **System Overview**
   - Visão geral do sistema
   - Status de todos os serviços
   - Métricas críticas

2. **Application Performance**
   - Performance da API
   - Response times
   - Throughput
   - Erros

3. **Database Monitoring**
   - Performance PostgreSQL
   - Conexões ativas
   - Query performance
   - Locks e deadlocks

4. **Cache Monitoring**
   - Performance Redis
   - Hit/miss ratio
   - Uso de memória
   - Comandos executados

5. **Infrastructure**
   - CPU, Memória, Disco
   - Network I/O
   - Docker containers
   - Alertas ativos

### 🔍 ELK Stack - Logging

**Pipeline de Logs:**
```
Aplicação → Filebeat → Logstash → Elasticsearch → Kibana
```

**Fontes de Logs:**
- Backend NestJS (aplicação)
- PostgreSQL (banco)
- Redis (cache)
- Nginx (proxy)
- Docker containers (sistema)

**Tipos de Logs Coletados:**
```json
{
  "timestamp": "2024-01-26T10:30:00.000Z",
  "level": "info|warn|error",
  "service": "backend|database|redis|nginx",
  "message": "Log message",
  "request_id": "uuid",
  "user_id": "user_id",
  "context": {...}
}
```

### 🔔 AlertManager - Alertas

**Alertas Configurados:**

1. **Serviços Críticos:**
   - Backend down
   - Database connection lost
   - Redis unavailable

2. **Performance:**
   - High CPU (>80%)
   - High Memory (>85%)
   - High response time (>2s)

3. **Aplicação:**
   - Error rate >5%
   - High number of 5xx errors
   - Database slow queries

4. **Infraestrutura:**
   - Disk space low (<10%)
   - Container restarts
   - Health check failures

### 🔗 Jaeger - Distributed Tracing

**Funcionalidades:**
- Rastreamento de requests
- Performance por endpoint
- Dependency mapping
- Error tracking

## 🗄️ Banco de Dados

### 📋 Esquema Principal

**Tabelas Principais:**
```sql
-- Usuários e autenticação
users
user_roles
user_sessions

-- Gestão de estoque
items
categories
stock_movements
inventory_levels

-- Auditoria
audit_logs
system_logs

-- Cache metadata
cache_metadata
```

**Recursos Implementados:**
- Auditoria completa de mudanças
- Soft deletes
- Timestamps automáticos
- Triggers para logs
- Indexes otimizados
- Foreign keys com cascading

### 🔄 Migrations e Seeds

**Estrutura:**
```
prisma/
├── migrations/
│   ├── 001_initial_schema/
│   ├── 002_add_audit_system/
│   └── 003_optimize_indexes/
└── seed.ts
```

**Scripts Disponíveis:**
```bash
# Aplicar migrations
cd BE-IGEMSTOCK
npx prisma migrate deploy

# Gerar cliente
npx prisma generate

# Executar seeds
npx prisma db seed

# Reset completo (DEV ONLY)
npx prisma migrate reset
```

### 💾 Backup e Restauração

**Backup Automático:**
```bash
# Via script
./DB/scripts/backup.sh

# Via manage.sh
./manage.sh backup

# Manual
docker-compose exec database pg_dump -U postgres igem_stock > backup.sql
```

**Configuração de Backup:**
- Backup diário automático
- Retenção de 30 dias
- Compressão gzip
- Verificação de integridade

## ⚡ Sistema de Cache (Redis)

### 🔧 Configurações

**Desenvolvimento (`CA/config/redis.conf`):**
```
maxmemory 256mb
maxmemory-policy allkeys-lru
save 900 1
appendonly yes
```

**Produção (`CA/config/redis.prod.conf`):**
```
maxmemory 512mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
appendonly yes
requirepass [senha_forte]
```

### 💾 Uso do Cache

**Estratégias Implementadas:**
1. **Cache de Sessões:** JWT tokens
2. **Cache de Queries:** Resultados de consultas frequentes
3. **Cache de Configurações:** Settings da aplicação
4. **Rate Limiting:** Controle de taxa de requests

**Padrões de Cache:**
```typescript
// Keys padronizadas
user:sessions:{user_id}
query:items:{hash}
config:settings
rate_limit:{ip}:{endpoint}
```

### 📊 Monitoramento Redis

**Métricas Coletadas:**
- Uso de memória
- Hit/miss ratio
- Comandos por segundo
- Conexões ativas
- Latência

## 🔐 Segurança

### 🛡️ Autenticação e Autorização

**JWT Configuration:**
```typescript
{
  secret: process.env.JWT_SECRET,
  expiresIn: '24h',
  algorithm: 'HS256'
}
```

**Roles e Permissões:**
```typescript
enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager', 
  USER = 'user',
  VIEWER = 'viewer'
}
```

### 🔒 Configurações de Segurança

**Headers de Segurança:**
```typescript
// helmet.js configuration
{
  contentSecurityPolicy: true,
  crossOriginEmbedderPolicy: true,
  dnsPrefetchControl: true,
  frameguard: true,
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: false,
  referrerPolicy: true,
  xssFilter: true
}
```

**Rate Limiting:**
```typescript
// Configuração global
{
  ttl: 60000, // 1 minute
  limit: 100  // 100 requests per minute
}

// Por endpoint
{
  '/api/auth/login': { ttl: 900000, limit: 5 },
  '/api/users': { ttl: 60000, limit: 50 }
}
```

### 🔐 Variáveis Sensíveis

**Produção - Obrigatórias:**
```bash
# Banco de dados
POSTGRES_PASSWORD=senha_muito_forte_32_chars_minimo

# JWT
JWT_SECRET=chave_jwt_super_segura_64_chars_recomendado

# Redis
REDIS_PASSWORD=senha_redis_forte_32_chars

# Grafana
GRAFANA_ADMIN_PASSWORD=senha_grafana_forte
GRAFANA_SECRET_KEY=chave_secreta_32_chars

# Elasticsearch (se habilitado)
ELASTICSEARCH_PASSWORD=senha_elastic_forte
```

## 🧪 Testes

### 🔬 Estratégia de Testes

**Tipos Implementados:**
1. **Testes Unitários:** Jest + testing utilities
2. **Testes de Integração:** Supertest
3. **Testes E2E:** Jest + TestContainers
4. **Testes de Performance:** Artillery

### 🎯 Cobertura de Testes

**Estrutura:**
```
BE-IGEMSTOCK/test/
├── unit/
│   ├── auth.service.spec.ts
│   ├── users.service.spec.ts
│   └── items.service.spec.ts
├── integration/
│   ├── auth.e2e-spec.ts
│   └── users.e2e-spec.ts
└── fixtures/
    └── test-data.ts
```

**Comandos:**
```bash
# Testes unitários
npm test

# Testes com coverage
npm run test:cov

# Testes E2E
npm run test:e2e

# Watch mode
npm run test:watch
```

## 🔄 CI/CD e Deploy

### 🚀 Pipeline de Deploy

**Fluxo Recomendado:**
```bash
# 1. Testes locais
npm test && npm run test:e2e

# 2. Build das imagens
docker-compose -f compose.prod.yaml build

# 3. Deploy
./manage.sh prod

# 4. Health check
./manage.sh health

# 5. Monitoramento
# Verificar dashboards Grafana
```

### 🐳 Docker Multi-stage

**Backend Dockerfile.prod:**
```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Runtime
FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
USER node
CMD ["npm", "run", "start:prod"]
```

## 📈 Performance e Otimização

### ⚡ Otimizações Implementadas

**Backend:**
- Connection pooling (PostgreSQL)
- Query optimization (Prisma)
- Caching strategy (Redis)
- Compression (gzip)
- Rate limiting

**Database:**
- Indexes otimizados
- Query optimization
- Connection pooling
- Prepared statements

**Cache:**
- TTL strategies
- Memory optimization
- Eviction policies
- Persistence configuration

### 📊 Métricas de Performance

**Targets de Performance:**
```yaml
API Response Time:
  - P50: < 100ms
  - P95: < 500ms
  - P99: < 1000ms

Database:
  - Query time P95: < 100ms
  - Connection utilization: < 80%

Cache:
  - Hit ratio: > 90%
  - Memory utilization: < 80%

System:
  - CPU utilization: < 70%
  - Memory utilization: < 80%
```

## 🔧 Troubleshooting

### 🩺 Diagnósticos Comuns

**1. Serviço não inicia:**
```bash
# Verificar logs
./manage.sh logs-dev backend

# Verificar configuração
docker-compose config

# Verificar portas
netstat -tulpn | grep :3000
```

**2. Banco de dados:**
```bash
# Conectar ao banco
docker-compose exec database psql -U postgres -d igem_stock_dev

# Verificar conexões
SELECT * FROM pg_stat_activity;

# Verificar logs
docker-compose logs database
```

**3. Redis:**
```bash
# Conectar ao Redis
docker-compose exec redis redis-cli

# Verificar status
docker-compose exec redis redis-cli info

# Verificar configuração
docker-compose exec redis redis-cli config get "*"
```

**4. Monitoramento:**
```bash
# Health check completo
./manage.sh health

# Verificar métricas
curl http://localhost:3000/metrics

# Verificar Prometheus targets
curl http://localhost:9090/api/v1/targets
```

### 🔄 Procedimentos de Recovery

**1. Reset completo (DEV):**
```bash
./manage.sh stop-dev
docker-compose down -v --remove-orphans
docker system prune -f
./manage.sh dev
```

**2. Restore de backup:**
```bash
# Parar serviços
./manage.sh stop-prod

# Restaurar dados
./DB/scripts/restore.sh backup_file.sql

# Reiniciar
./manage.sh prod
```

**3. Problemas de performance:**
```bash
# Verificar métricas sistema
docker stats

# Verificar logs de erro
./manage.sh logs-prod | grep ERROR

# Verificar Grafana dashboards
# http://localhost:3030
```

## 📝 Checklist de Deploy

### ✅ Pré-Deploy

- [ ] Configurar variáveis no `.env`
- [ ] Validar senhas fortes
- [ ] Testar localmente
- [ ] Fazer backup dos dados
- [ ] Verificar recursos do servidor

### ✅ Deploy

- [ ] Executar `./manage.sh prod`
- [ ] Aguardar todos os serviços (2-3 minutos)
- [ ] Executar `./manage.sh health`
- [ ] Verificar dashboards Grafana
- [ ] Testar endpoints críticos

### ✅ Pós-Deploy

- [ ] Configurar alertas
- [ ] Configurar backup automático
- [ ] Documentar configurações específicas
- [ ] Treinar equipe de operações
- [ ] Estabelecer procedimentos de monitoramento

## 🎓 Recursos de Aprendizado

### 📚 Documentação Técnica

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)

### 🔗 Links Úteis

- **Repositório:** https://github.com/vini-barbo/MasterAzimov
- **Issues:** https://github.com/vini-barbo/MasterAzimov/issues
- **Wiki:** https://github.com/vini-barbo/MasterAzimov/wiki

---

## 📞 Suporte

Para suporte técnico ou dúvidas:

1. **Documentação:** Consulte este documento primeiro
2. **Issues:** Abra uma issue no GitHub
3. **Logs:** Use `./manage.sh logs-[env] [service]`
4. **Monitoramento:** Verifique dashboards Grafana

---

**📅 Última atualização:** $(date +"%d/%m/%Y às %H:%M")  
**👥 Mantido por:** Vinícius Barbosa (@vini-barbo)  
**🏷️ Versão:** 1.0.0  

---

**🚀 Master Azimov - Sistema Completo de Gestão com Monitoramento Avançado**
