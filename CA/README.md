# Redis Cache (CA) - Cache Layer

Este diretório contém toda a configuração e infraestrutura para o cache Redis do projeto Master Azimov.

## 📁 Estrutura do Projeto

```
CA/
├── config/                     # Configurações do Redis
│   ├── redis.conf             # Configuração para desenvolvimento
│   ├── redis.prod.conf        # Configuração para produção
│   ├── redis.test.conf        # Configuração para testes
│   └── logrotate.conf         # Configuração de rotação de logs
├── scripts/                   # Scripts de automação
│   ├── entrypoint.sh         # Script de inicialização
│   ├── healthcheck.sh        # Verificação de saúde
│   ├── backup.sh             # Backup e restore
│   └── monitor.sh            # Monitoramento
├── Dockerfile                # Dockerfile para desenvolvimento
├── Dockerfile.prod          # Dockerfile para produção
├── docker-compose.yml       # Compose para desenvolvimento
├── docker-compose.prod.yml  # Compose para produção
├── docker-compose.test.yml  # Compose para testes
├── .env.dev                 # Variáveis de ambiente - dev
├── .env.prod                # Variáveis de ambiente - prod
├── .env.test                # Variáveis de ambiente - test
├── redis.sh                 # Script de gerenciamento
└── README.md                # Este arquivo
```

## 🚀 Início Rápido

### Desenvolvimento

```bash
# Tornar o script executável
chmod +x redis.sh

# Iniciar ambiente de desenvolvimento
./redis.sh dev up

# Verificar status
./redis.sh dev status

# Verificar saúde
./redis.sh dev health
```

### Produção

```bash
# Configurar variáveis de ambiente
cp .env.prod .env
# Editar .env com valores de produção

# Iniciar ambiente de produção
./redis.sh prod up

# Monitorar
./redis.sh prod monitor
```

## 🔧 Comandos Disponíveis

### Script de Gerenciamento

O script `redis.sh` fornece uma interface simples para gerenciar o Redis:

```bash
./redis.sh <ambiente> <comando>
```

**Ambientes:**
- `dev` - Desenvolvimento (padrão)
- `prod` - Produção
- `test` - Testes

**Comandos:**
- `up/start` - Iniciar serviços
- `down/stop` - Parar serviços
- `restart` - Reiniciar serviços
- `logs` - Mostrar logs
- `status` - Status dos serviços
- `health` - Verificação de saúde
- `monitor` - Informações de monitoramento
- `backup` - Criar backup
- `restore` - Restaurar backup
- `shell` - Abrir Redis CLI
- `bash` - Abrir shell bash
- `clean` - Limpar containers e volumes
- `reset` - Resetar dados do Redis
- `benchmark` - Teste de performance

### Exemplos de Uso

```bash
# Desenvolvimento
./redis.sh dev up           # Iniciar
./redis.sh dev logs         # Ver logs
./redis.sh dev shell        # Redis CLI
./redis.sh dev monitor      # Monitoramento

# Produção
./redis.sh prod up          # Iniciar produção
./redis.sh prod backup      # Criar backup
./redis.sh prod health      # Verificar saúde

# Testes
./redis.sh test up          # Ambiente de teste
./redis.sh test reset       # Limpar dados de teste
```

## 📊 Monitoramento

### Web UIs Disponíveis

1. **Redis Commander** (desenvolvimento)
   - URL: http://localhost:8081
   - Usuário: admin / Senha: admin (configurável)

2. **Redis Exporter** (Prometheus metrics)
   - URL: http://localhost:9121/metrics

### Monitoramento via Script

```bash
# Informações completas
./redis.sh dev monitor

# Informações específicas
docker-compose exec redis /usr/local/bin/scripts/monitor.sh memory
docker-compose exec redis /usr/local/bin/scripts/monitor.sh stats
docker-compose exec redis /usr/local/bin/scripts/monitor.sh clients
```

## 💾 Backup e Restore

### Backup Automático

```bash
# Criar backup manual
./redis.sh prod backup

# Listar backups
docker-compose -f docker-compose.prod.yml exec redis /usr/local/bin/scripts/backup.sh list

# Backup via cron (adicionar ao crontab)
0 2 * * * /path/to/redis.sh prod backup
```

### Restore

```bash
# Restaurar de um backup específico
./redis.sh prod restore /backups/redis_backup_20250726_120000.rdb.gz
```

## 🔒 Segurança

### Configurações de Segurança

1. **Senhas**: Configure `REDIS_PASSWORD` nas variáveis de ambiente
2. **Comandos Perigosos**: Desabilitados em produção (FLUSHDB, FLUSHALL, etc.)
3. **Rede**: Isolada em rede Docker dedicada
4. **Usuário**: Executa como usuário não-root

### Configuração de Produção

```bash
# .env.prod
REDIS_PASSWORD=your_super_secure_password_here
REDIS_MAXMEMORY=4gb
REDIS_MEMORY_LIMIT=8G
```

## 📈 Performance

### Configurações Otimizadas

- **Desenvolvimento**: 256MB RAM, configurações básicas
- **Produção**: 2GB+ RAM, configurações otimizadas
- **Teste**: 128MB RAM, configurações mínimas

### Benchmark

```bash
# Executar teste de performance
./redis.sh dev benchmark
```

## 🐛 Troubleshooting

### Problemas Comuns

1. **Redis não inicia**:
   ```bash
   ./redis.sh dev logs
   ./redis.sh dev health
   ```

2. **Erro de memória**:
   - Verificar configuração `maxmemory`
   - Ajustar `REDIS_MAXMEMORY` no .env

3. **Problemas de conectividade**:
   ```bash
   docker-compose exec redis redis-cli ping
   ```

### Logs

```bash
# Logs em tempo real
./redis.sh dev logs

# Logs específicos
docker-compose logs redis
docker-compose logs redis-exporter
```

## 🔄 Integração com Backend

### Configuração no Backend (NestJS)

```typescript
// app.module.ts
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      ttl: 300, // 5 minutes
    }),
  ],
})
export class AppModule {}
```

### Variáveis de Ambiente do Backend

```bash
REDIS_HOST=redis  # Nome do serviço no Docker
REDIS_PORT=6379
REDIS_PASSWORD=dev_password_123
```

## 📋 Checklist de Deploy

### Antes do Deploy

- [ ] Configurar senhas fortes
- [ ] Ajustar limites de memória
- [ ] Configurar backup automático
- [ ] Testar conectividade
- [ ] Configurar monitoramento

### Pós Deploy

- [ ] Verificar saúde do serviço
- [ ] Testar operações básicas
- [ ] Configurar alertas
- [ ] Documentar credenciais
- [ ] Agendar backups

## 🆘 Suporte

Para problemas ou dúvidas:

1. Verificar logs: `./redis.sh <env> logs`
2. Executar health check: `./redis.sh <env> health`
3. Consultar documentação oficial do Redis
4. Verificar issues conhecidos no projeto

## 📚 Documentação Adicional

- [Redis Documentation](https://redis.io/documentation)
- [Redis Configuration](https://redis.io/topics/config)
- [Redis Security](https://redis.io/topics/security)
- [Redis Persistence](https://redis.io/topics/persistence)
