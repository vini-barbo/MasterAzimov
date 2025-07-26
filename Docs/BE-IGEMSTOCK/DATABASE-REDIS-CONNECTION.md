# Conexão com Banco de Dados e Redis - IGEM Stock Backend

Este documento descreve como o backend se conecta com PostgreSQL e Redis.

## 🗄️ Configuração do Banco de Dados (PostgreSQL)

### Dependências Utilizadas
- `@prisma/client` - Cliente do Prisma ORM
- `prisma` - CLI e ferramentas do Prisma

### Estrutura de Arquivos
```
src/
├── database/
│   ├── database.module.ts    # Módulo global do banco
│   └── prisma.service.ts     # Serviço do Prisma
├── config/
│   ├── database.config.ts    # Configurações do banco
│   └── index.ts             # Exportações das configs
prisma/
├── schema.prisma            # Schema do banco
└── seed.ts                 # Dados iniciais
```

### Configuração do Prisma
O Prisma está configurado para:
- Conectar automaticamente na inicialização
- Desconectar graciosamente no shutdown
- Usar connection pooling
- Suportar migrações automáticas

### Variáveis de Ambiente
```bash
DATABASE_URL=postgresql://postgres:postgres123@database:5432/igem_stock_dev?schema=public
POSTGRES_HOST=database
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
POSTGRES_DB=igem_stock_dev
```

### Comandos Úteis
```bash
# Gerar cliente Prisma
npm run db:generate

# Aplicar schema ao banco (desenvolvimento)
npm run db:push

# Criar nova migração
npm run db:migrate

# Aplicar migrações (produção)
npm run db:migrate:deploy

# Reset completo do banco
npm run db:reset

# Popular com dados iniciais
npm run db:seed

# Interface visual do banco
npm run db:studio
```

## 🔴 Configuração do Redis

### Dependências Utilizadas
- `ioredis` - Cliente Redis robusto
- `@nestjs/cache-manager` - Cache manager do NestJS
- `cache-manager-ioredis` - Integração Redis com cache-manager

### Estrutura de Arquivos
```
src/
├── redis/
│   ├── redis.module.ts      # Módulo do Redis
│   └── redis.service.ts     # Serviço customizado do Redis
└── config/
    └── redis.config.ts      # Configurações do Redis
```

### Funcionalidades Configuradas
- **Cache Global**: Configurado via `@nestjs/cache-manager`
- **Serviço Redis**: Para operações específicas (strings, hashes, etc.)
- **Connection Pooling**: Configuração otimizada para produção
- **Retry Logic**: Reconexão automática em caso de falhas

### Variáveis de Ambiente
```bash
REDIS_URL=redis://redis:6379
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_TTL=600
```

### Uso do Cache
```typescript
// Injetar o serviço de cache
constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}

// Usar cache
await this.cacheService.set('key', 'value', 300); // TTL 5 min
const value = await this.cacheService.get('key');
```

### Uso do Redis Service
```typescript
// Injetar o serviço Redis
constructor(private redisService: RedisService) {}

// Operações básicas
await this.redisService.set('key', 'value', 'EX', 300);
const value = await this.redisService.get('key');

// Operações hash
await this.redisService.hset('user:1', 'name', 'John');
const name = await this.redisService.hget('user:1', 'name');
```

## 🏥 Health Check

### Endpoint de Saúde
- **URL**: `GET /api/health`
- **Descrição**: Verifica conectividade com banco e Redis
- **Resposta**:
```json
{
  "status": "ok",
  "timestamp": "2025-01-26T10:30:00.000Z",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

## 🚀 Inicialização

### Desenvolvimento
```bash
# 1. Subir serviços via Docker
docker-compose up -d database redis

# 2. Configurar ambiente
cd BE-IGEMSTOCK
./setup-dev.sh

# 3. Iniciar desenvolvimento
npm run start:dev
```

### Produção
```bash
# Aplicar migrações
npm run db:migrate:deploy

# Iniciar aplicação
npm run start:prod
```

## 🔧 Troubleshooting

### Problemas Comuns

1. **Erro de Conexão com Banco**
   ```bash
   # Verificar se o banco está rodando
   docker ps | grep postgres
   
   # Verificar logs do banco
   docker logs igem-stock-db-dev
   ```

2. **Erro de Conexão com Redis**
   ```bash
   # Verificar se o Redis está rodando
   docker ps | grep redis
   
   # Testar conexão
   redis-cli -h localhost -p 6379 ping
   ```

3. **Schema não sincronizado**
   ```bash
   # Regenerar cliente Prisma
   npm run db:generate
   
   # Aplicar schema
   npm run db:push
   ```

4. **Problemas de Migração**
   ```bash
   # Reset completo (⚠️ CUIDADO: apaga dados)
   npm run db:reset
   
   # Aplicar manualmente
   npx prisma migrate dev
   ```

## 📊 Monitoramento

### Logs
- Conexões são logadas no startup
- Erros de conexão são capturados e logados
- Health check disponível em `/api/health`

### Métricas Importantes
- Tempo de resposta do banco
- Status de conexão Redis
- Pool de conexões ativo
- Cache hit rate

### Ferramentas
- **Prisma Studio**: Interface visual do banco
- **Redis CLI**: Debugging do Redis
- **Docker logs**: Logs dos serviços
