# Redis Cache Integration Guide

## Integração com Docker Compose Principal

Para integrar o Redis Cache com o docker-compose principal do projeto, adicione o seguinte ao arquivo `compose.yaml` na raiz:

```yaml
version: '3.8'

services:
  # ... outros serviços ...

  redis:
    build:
      context: ./CA
      dockerfile: Dockerfile
    container_name: redis-cache
    restart: unless-stopped
    environment:
      - REDIS_PASSWORD=${REDIS_PASSWORD:-dev_password_123}
      - REDIS_MAXMEMORY=${REDIS_MAXMEMORY:-512mb}
      - REDIS_MAXMEMORY_POLICY=${REDIS_MAXMEMORY_POLICY:-allkeys-lru}
    volumes:
      - redis_data:/data
      - redis_logs:/var/log/redis
    networks:
      - app_network
    healthcheck:
      test: ["CMD", "/usr/local/bin/healthcheck.sh"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s

  # ... outros serviços ...

volumes:
  redis_data:
  redis_logs:
  # ... outros volumes ...

networks:
  app_network:
    driver: bridge
```

## Integração com Backend (NestJS)

### 1. Instalar dependências

```bash
cd BE-IGEMSTOCK
npm install @nestjs/cache-manager cache-manager cache-manager-redis-store redis
```

### 2. Configurar no app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST || 'redis',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD,
      ttl: parseInt(process.env.CACHE_TTL) || 300, // 5 minutes
      max: parseInt(process.env.CACHE_MAX_ITEMS) || 100,
    }),
    // ... outros módulos
  ],
})
export class AppModule {}
```

### 3. Usar cache nos services

```typescript
import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class ExampleService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async getCachedData(key: string): Promise<any> {
    return await this.cacheService.get(key);
  }

  async setCachedData(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheService.set(key, value, ttl);
  }

  async deleteCachedData(key: string): Promise<void> {
    await this.cacheService.del(key);
  }

  async clearAllCache(): Promise<void> {
    await this.cacheService.reset();
  }
}
```

### 4. Usar decoradores de cache

```typescript
import { Controller, Get, UseInterceptors, CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/common';

@Controller('example')
@UseInterceptors(CacheInterceptor)
export class ExampleController {
  
  @Get('data')
  @CacheKey('example_data')
  @CacheTTL(300) // 5 minutes
  async getData() {
    // Este resultado será cacheado automaticamente
    return { message: 'Data from cache or API' };
  }
}
```

## Variáveis de Ambiente

Adicione ao arquivo `.env` do backend:

```bash
# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=dev_password_123

# Cache Configuration
CACHE_TTL=300
CACHE_MAX_ITEMS=1000
```

## Configuração do Nginx

Para expor o Redis Commander em produção (opcional), adicione ao nginx.conf:

```nginx
# Redis Commander (apenas em desenvolvimento)
location /redis-admin/ {
    proxy_pass http://redis-commander:8081/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # Autenticação básica (recomendado)
    auth_basic "Redis Admin";
    auth_basic_user_file /etc/nginx/.htpasswd;
}
```

## Scripts de Automação

### Backup Automático via Cron

```bash
# Adicionar ao crontab
0 2 * * * /path/to/master-azimov/CA/redis.sh prod backup

# Cleanup semanal
0 3 * * 0 /path/to/master-azimov/CA/redis.sh prod clean
```

### Monitoramento

```bash
# Status check
*/5 * * * * /path/to/master-azimov/CA/redis.sh prod health

# Alertas via webhook
#!/bin/bash
if ! /path/to/master-azimov/CA/redis.sh prod health > /dev/null 2>&1; then
    curl -X POST "https://hooks.slack.com/your-webhook-url" \
         -H "Content-type: application/json" \
         -d '{"text":"Redis Cache is down!"}'
fi
```

## Comandos Úteis

```bash
# Desenvolvimento
./redis.sh dev up
./redis.sh dev shell
./redis.sh dev monitor

# Produção
./redis.sh prod up
./redis.sh prod backup
./redis.sh prod health

# Debugging
docker-compose -f CA/docker-compose.yml logs redis
docker-compose -f CA/docker-compose.yml exec redis redis-cli info
```
