# 🛠️ Manual de Operações - Master Azimov

## 📋 Guia Operacional Completo

Este documento fornece instruções detalhadas para operação, manutenção e troubleshooting do sistema Master Azimov em ambiente de produção.

## 🚀 Início Rápido

### ⚡ Setup Inicial (5 minutos)

```bash
# 1. Clone o repositório
git clone https://github.com/vini-barbo/MasterAzimov.git
cd MasterAzimov

# 2. Configure o ambiente
cp .env.example .env
# Edite o .env com suas configurações

# 3. Inicie o ambiente de desenvolvimento
./manage.sh dev

# 4. Verifique a saúde dos serviços
./manage.sh health
```

### 🌐 Acessos Principais

| Serviço | URL | Credenciais | Função |
|---------|-----|-------------|---------|
| **API Backend** | http://localhost:3000 | - | Sistema principal |
| **Grafana** | http://localhost:3030 | admin/admin123 | Monitoramento |
| **Prometheus** | http://localhost:9090 | - | Métricas |
| **Kibana** | http://localhost:5601 | - | Logs |
| **pgAdmin** | http://localhost:5050 | admin@igemstock.com/admin123 | Banco |
| **RedisInsight** | http://localhost:8001 | - | Cache |

## 🔧 Comandos Operacionais

### 📊 Script Principal (manage.sh)

#### 🚀 Desenvolvimento
```bash
# Ambiente básico (API + DB + Cache)
./manage.sh dev

# Ambiente completo (com ELK stack)
./manage.sh dev-full

# Parar desenvolvimento
./manage.sh stop-dev

# Logs de desenvolvimento
./manage.sh logs-dev                # Todos os serviços
./manage.sh logs-dev backend        # Serviço específico
```

#### 🏭 Produção
```bash
# Iniciar produção (stack completa)
./manage.sh prod

# Parar produção
./manage.sh stop-prod

# Logs de produção
./manage.sh logs-prod               # Todos os serviços
./manage.sh logs-prod grafana       # Serviço específico
```

#### 🔍 Operações Gerais
```bash
# Status de todos os serviços
./manage.sh status

# Health check completo
./manage.sh health

# Backup completo
./manage.sh backup

# Limpeza do sistema
./manage.sh cleanup
```

### 🐳 Docker Compose Direto

#### 📝 Desenvolvimento
```bash
# Iniciar serviços específicos
docker-compose -f compose.yaml up -d database redis backend

# Ver logs em tempo real
docker-compose -f compose.yaml logs -f backend

# Parar e remover volumes (CUIDADO: remove dados)
docker-compose -f compose.yaml down -v

# Rebuild completo
docker-compose -f compose.yaml down
docker-compose -f compose.yaml build --no-cache
docker-compose -f compose.yaml up -d
```

#### 🏭 Produção
```bash
# Iniciar com arquivo de ambiente
docker-compose -f compose.prod.yaml --env-file .env.prod up -d

# Build e deploy
docker-compose -f compose.prod.yaml build --no-cache
docker-compose -f compose.prod.yaml up -d

# Parar sem remover dados
docker-compose -f compose.prod.yaml down

# Ver status
docker-compose -f compose.prod.yaml ps
```

## 🔍 Monitoramento e Troubleshooting

### 📊 Verificações de Saúde

#### 🏥 Health Checks Manuais
```bash
# Backend API
curl -f http://localhost:3000/health
curl -f http://localhost:3000/metrics

# Banco de dados
docker-compose exec database pg_isready -U postgres

# Redis
docker-compose exec redis redis-cli ping

# Prometheus
curl -f http://localhost:9090/-/healthy

# Grafana
curl -f http://localhost:3030/api/health
```

#### 📈 Verificação de Métricas
```bash
# Métricas da aplicação
curl http://localhost:3000/metrics

# Status do Prometheus
curl http://localhost:9090/api/v1/targets

# Verificar alertas ativos
curl http://localhost:9093/api/v1/alerts
```

### 🔧 Diagnósticos Comuns

#### 🚫 Serviço não inicia

**1. Verificar logs:**
```bash
# Logs do serviço específico
./manage.sh logs-dev backend

# Logs com timestamps
docker-compose logs -t backend

# Últimas 100 linhas
docker-compose logs --tail=100 backend
```

**2. Verificar configuração:**
```bash
# Validar compose file
docker-compose -f compose.yaml config

# Verificar variáveis de ambiente
docker-compose exec backend env | grep -E "(DATABASE|REDIS|JWT)"

# Verificar conectividade
docker-compose exec backend nc -zv database 5432
```

**3. Verificar recursos:**
```bash
# Status dos containers
docker stats

# Espaço em disco
df -h

# Uso de memória
free -h

# Verificar portas
netstat -tulpn | grep -E "(3000|5432|6379)"
```

#### 🗄️ Problemas de Banco de Dados

**1. Conexão recusada:**
```bash
# Verificar se o PostgreSQL está rodando
docker-compose ps database

# Verificar logs do banco
docker-compose logs database

# Conectar manualmente
docker-compose exec database psql -U postgres -d igem_stock_dev

# Verificar conexões ativas
docker-compose exec database psql -U postgres -c "SELECT * FROM pg_stat_activity;"
```

**2. Performance lenta:**
```bash
# Verificar queries lentas
docker-compose exec database psql -U postgres -c "
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;"

# Verificar locks
docker-compose exec database psql -U postgres -c "
SELECT * FROM pg_locks 
WHERE NOT granted;"

# Reindexar se necessário (cuidado em produção)
docker-compose exec database psql -U postgres -c "REINDEX DATABASE igem_stock_dev;"
```

#### ⚡ Problemas de Cache (Redis)

**1. Redis não responde:**
```bash
# Verificar status
docker-compose ps redis

# Verificar logs
docker-compose logs redis

# Conectar ao Redis
docker-compose exec redis redis-cli

# Verificar informações
docker-compose exec redis redis-cli info
```

**2. Cache com performance ruim:**
```bash
# Verificar estatísticas
docker-compose exec redis redis-cli info stats

# Verificar uso de memória
docker-compose exec redis redis-cli info memory

# Verificar keys mais usadas
docker-compose exec redis redis-cli --hotkeys

# Limpar cache (CUIDADO: remove todos os dados)
docker-compose exec redis redis-cli FLUSHALL
```

#### 📊 Problemas de Monitoramento

**1. Grafana não carrega dashboards:**
```bash
# Verificar status do Grafana
curl -f http://localhost:3030/api/health

# Verificar logs
docker-compose logs grafana

# Verificar datasources
curl -u admin:admin123 http://localhost:3030/api/datasources

# Reimportar dashboards
docker-compose restart grafana
```

**2. Prometheus não coleta métricas:**
```bash
# Verificar targets
curl http://localhost:9090/api/v1/targets

# Verificar configuração
docker-compose exec prometheus cat /etc/prometheus/prometheus.yml

# Recarregar configuração
curl -X POST http://localhost:9090/-/reload
```

**3. Logs não aparecem no Kibana:**
```bash
# Verificar Elasticsearch
curl http://localhost:9200/_cluster/health

# Verificar indices
curl http://localhost:9200/_cat/indices

# Verificar Logstash
docker-compose logs logstash

# Verificar Filebeat
docker-compose logs filebeat
```

## 💾 Backup e Recovery

### 📦 Backup Completo

#### 🔄 Backup Automático
```bash
# Usar o script principal
./manage.sh backup

# Ou via script específico do Monitor
cd Monitor
./scripts/backup-logs.sh backup
```

#### 📋 Backup Manual por Componente

**1. PostgreSQL:**
```bash
# Backup completo
docker-compose exec database pg_dump -U postgres igem_stock_dev > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup comprimido
docker-compose exec database pg_dump -U postgres igem_stock_dev | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Backup de schema apenas
docker-compose exec database pg_dump -U postgres -s igem_stock_dev > schema_backup.sql
```

**2. Redis:**
```bash
# Backup RDB
docker-compose exec redis redis-cli BGSAVE
docker cp $(docker-compose ps -q redis):/data/dump.rdb ./redis_backup_$(date +%Y%m%d_%H%M%S).rdb

# Backup AOF
docker cp $(docker-compose ps -q redis):/data/appendonly.aof ./redis_aof_backup_$(date +%Y%m%d_%H%M%S).aof
```

**3. Configurações:**
```bash
# Backup das configurações
tar -czf config_backup_$(date +%Y%m%d_%H%M%S).tar.gz \
  Monitor/grafana/provisioning \
  Monitor/prometheus/prometheus.yml \
  CA/config \
  DB/init-scripts \
  .env
```

### 🔄 Recovery/Restauração

#### 🗄️ Restaurar PostgreSQL
```bash
# Parar aplicação
./manage.sh stop-dev

# Restaurar backup
docker-compose up -d database
sleep 10
docker-compose exec database psql -U postgres -c "DROP DATABASE IF EXISTS igem_stock_dev;"
docker-compose exec database psql -U postgres -c "CREATE DATABASE igem_stock_dev;"
cat backup_file.sql | docker-compose exec -T database psql -U postgres igem_stock_dev

# Reiniciar aplicação
./manage.sh dev
```

#### ⚡ Restaurar Redis
```bash
# Parar Redis
docker-compose stop redis

# Copiar backup
docker cp redis_backup.rdb $(docker-compose ps -q redis):/data/dump.rdb

# Iniciar Redis
docker-compose start redis
```

### 📅 Rotina de Backup

#### 🕐 Script de Backup Diário
```bash
#!/bin/bash
# backup_daily.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/$DATE"
mkdir -p "$BACKUP_DIR"

# PostgreSQL
docker-compose exec database pg_dump -U postgres igem_stock > "$BACKUP_DIR/postgres.sql"

# Redis
docker-compose exec redis redis-cli BGSAVE
docker cp $(docker-compose ps -q redis):/data/dump.rdb "$BACKUP_DIR/redis.rdb"

# Configurações
tar -czf "$BACKUP_DIR/configs.tar.gz" Monitor/ CA/config/ DB/init-scripts/ .env

# Logs
docker-compose logs > "$BACKUP_DIR/containers.log"

# Limpeza (manter apenas 30 dias)
find /backups -type d -mtime +30 -exec rm -rf {} \;

echo "Backup completo em: $BACKUP_DIR"
```

#### ⏰ Configurar Cron
```bash
# Adicionar ao crontab
crontab -e

# Backup diário às 2:00 AM
0 2 * * * /path/to/MasterAzimov/backup_daily.sh >> /var/log/backup.log 2>&1
```

## 🔐 Segurança e Manutenção

### 🛡️ Verificações de Segurança

#### 🔒 Audit de Configurações
```bash
# Verificar senhas fracas
grep -E "(password|secret)" .env | grep -E "(123|admin|test)"

# Verificar permissões de arquivos
find . -name "*.env*" -exec ls -la {} \;

# Verificar containers rodando como root
docker ps --format "table {{.Names}}\t{{.Command}}" | grep -v "node\|postgres\|redis"
```

#### 🔍 Log de Auditoria
```bash
# Verificar logs de autenticação
docker-compose logs backend | grep -i "auth\|login"

# Verificar tentativas de acesso negadas
docker-compose logs backend | grep -E "(401|403|unauthorized)"

# Verificar padrões suspeitos
docker-compose logs backend | grep -E "(sql injection|xss|csrf)"
```

### 🔧 Manutenção Regular

#### 📊 Limpeza de Logs
```bash
# Limpar logs antigos do Docker
docker system prune -f

# Rotacionar logs manualmente
docker-compose down
docker system prune --volumes -f
docker-compose up -d

# Configurar rotação automática
# Em /etc/docker/daemon.json:
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

#### 🗄️ Manutenção do Banco
```bash
# VACUUM do PostgreSQL
docker-compose exec database psql -U postgres -d igem_stock_dev -c "VACUUM ANALYZE;"

# Verificar estatísticas
docker-compose exec database psql -U postgres -d igem_stock_dev -c "
SELECT schemaname, tablename, n_tup_ins, n_tup_upd, n_tup_del 
FROM pg_stat_user_tables 
ORDER BY n_tup_ins DESC;"

# Reindexar se necessário (fazer em horário de baixo uso)
docker-compose exec database psql -U postgres -d igem_stock_dev -c "REINDEX DATABASE igem_stock_dev;"
```

#### ⚡ Otimização do Redis
```bash
# Verificar fragmentação
docker-compose exec redis redis-cli info memory | grep fragmentation

# Executar defrag se necessário
docker-compose exec redis redis-cli memory doctor

# Limpar keys expiradas
docker-compose exec redis redis-cli --scan --pattern "*" | while read key; do
  ttl=$(docker-compose exec redis redis-cli ttl "$key")
  if [ "$ttl" = "-2" ]; then
    docker-compose exec redis redis-cli del "$key"
  fi
done
```

## 📊 Monitoramento de Performance

### 📈 Métricas Importantes

#### 🎯 KPIs do Sistema
```bash
# Response time médio (últimas 24h)
curl -s 'http://localhost:9090/api/v1/query?query=rate(http_request_duration_seconds_sum[24h])/rate(http_request_duration_seconds_count[24h])'

# Taxa de erro (últimas 24h)
curl -s 'http://localhost:9090/api/v1/query?query=rate(http_requests_total{status=~"5.."}[24h])/rate(http_requests_total[24h])*100'

# Throughput (requests por minuto)
curl -s 'http://localhost:9090/api/v1/query?query=rate(http_requests_total[1m])*60'

# Uso de CPU
curl -s 'http://localhost:9090/api/v1/query?query=100-(avg(rate(node_cpu_seconds_total{mode="idle"}[5m]))*100)'

# Uso de memória
curl -s 'http://localhost:9090/api/v1/query?query=(1-node_memory_MemAvailable_bytes/node_memory_MemTotal_bytes)*100'
```

#### 🗄️ Métricas de Banco
```bash
# Conexões ativas
docker-compose exec database psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"

# Queries mais lentas
docker-compose exec database psql -U postgres -c "
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 5;"

# Tamanho do banco
docker-compose exec database psql -U postgres -c "
SELECT pg_size_pretty(pg_database_size('igem_stock_dev'));"
```

### 🔔 Configuração de Alertas

#### ⚠️ Alertas Críticos
```yaml
# Editar Monitor/prometheus/rules/alerts.yml
groups:
  - name: critical
    rules:
      - alert: ServiceDown
        expr: up == 0
        for: 1m
        annotations:
          summary: "Serviço {{ $labels.instance }} está down"

      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 2m
        annotations:
          summary: "Taxa de erro alta: {{ $value }}%"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 3m
        annotations:
          summary: "Response time alto: {{ $value }}s"
```

#### 📧 Configurar Notificações
```yaml
# Editar Monitor/alertmanager/alertmanager.yml
route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'web.hook'

receivers:
  - name: 'web.hook'
    webhook_configs:
      - url: 'http://localhost:5001/'
        
  - name: 'email'
    email_configs:
      - to: 'admin@company.com'
        subject: 'Alerta Master Azimov'
        body: 'Alerta: {{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'
```

## 🔄 Deploy e Atualizações

### 🚀 Deploy em Produção

#### 📋 Checklist Pré-Deploy
```bash
# 1. Backup completo
./manage.sh backup

# 2. Testes locais
npm test
./manage.sh health

# 3. Build das imagens
docker-compose -f compose.prod.yaml build

# 4. Validar configurações
docker-compose -f compose.prod.yaml config

# 5. Deploy
./manage.sh prod

# 6. Verificação pós-deploy
./manage.sh health
curl -f http://localhost:3000/health
```

#### 🔄 Atualizações Zero-Downtime
```bash
# 1. Deploy da nova versão
docker-compose -f compose.prod.yaml pull
docker-compose -f compose.prod.yaml up -d --no-deps backend

# 2. Aguardar health check
sleep 30
curl -f http://localhost:3000/health

# 3. Se OK, atualizar outros serviços
docker-compose -f compose.prod.yaml up -d

# 4. Verificação final
./manage.sh health
```

### 📦 Rollback

#### ⏪ Rollback Rápido
```bash
# 1. Parar serviços atuais
./manage.sh stop-prod

# 2. Restaurar imagens anteriores
docker tag master-azimov_backend:previous master-azimov_backend:latest

# 3. Restaurar dados se necessário
./DB/scripts/restore.sh backup_pre_deploy.sql

# 4. Reiniciar
./manage.sh prod

# 5. Verificar
./manage.sh health
```

## 📞 Suporte e Contatos

### 🆘 Procedimentos de Emergência

#### 🚨 Serviço Crítico Down
1. **Verificar status:** `./manage.sh status`
2. **Verificar logs:** `./manage.sh logs-prod [service]`
3. **Tentar restart:** `docker-compose restart [service]`
4. **Se não resolver:** `./manage.sh stop-prod && ./manage.sh prod`
5. **Escalar se necessário**

#### 🔥 Performance Degradada
1. **Verificar dashboards:** http://localhost:3030
2. **Verificar métricas:** http://localhost:9090
3. **Identificar gargalo:** CPU/Memory/DB/Cache
4. **Aplicar correção específica**
5. **Monitorar recovery**

#### 💾 Corrupção de Dados
1. **Parar serviços imediatamente:** `./manage.sh stop-prod`
2. **Avaliar extensão do problema**
3. **Restaurar do backup mais recente**
4. **Verificar integridade pós-restore**
5. **Reiniciar serviços gradualmente**

### 📋 Contatos de Suporte

| Tipo | Contato | Responsabilidade |
|------|---------|------------------|
| **Desenvolvedor Principal** | @vini-barbo | Código e arquitetura |
| **DevOps** | @vini-barbo | Infraestrutura e deploy |
| **DBA** | @vini-barbo | Banco de dados |
| **Monitoramento** | @vini-barbo | Alertas e dashboards |

### 📚 Recursos Adicionais

- **GitHub:** https://github.com/vini-barbo/MasterAzimov
- **Issues:** https://github.com/vini-barbo/MasterAzimov/issues
- **Wiki:** https://github.com/vini-barbo/MasterAzimov/wiki
- **Documentação:** `/Docs/` folder

---

## 📝 Registro de Operações

### 📊 Template de Incident Report
```markdown
# Incident Report - $(date)

## Resumo
- **Data/Hora:** 
- **Duração:** 
- **Severidade:** [Critical/High/Medium/Low]
- **Serviços Afetados:** 

## Descrição do Problema
[Descrever o que aconteceu]

## Timeline
- **HH:MM** - Problema detectado
- **HH:MM** - Investigação iniciada
- **HH:MM** - Causa identificada
- **HH:MM** - Solução aplicada
- **HH:MM** - Serviço restaurado

## Causa Raiz
[Explicar a causa do problema]

## Solução Aplicada
[Descrever as ações tomadas]

## Ações Preventivas
[O que será feito para evitar recorrência]

## Lições Aprendidas
[Melhorias no processo/documentação]
```

### 📅 Log de Manutenções
```markdown
# Maintenance Log

| Data | Tipo | Serviços | Duração | Responsável | Observações |
|------|------|----------|---------|-------------|-------------|
| 2024-01-26 | Update | Backend | 15min | @vini-barbo | Deploy v1.1.0 |
| 2024-01-25 | Backup | All | 30min | @vini-barbo | Backup mensal |
```

---

**📅 Última atualização:** $(date +"%d/%m/%Y às %H:%M")  
**📖 Versão do documento:** 1.0.0  
**👨‍💻 Responsável:** Vinícius Barbosa (@vini-barbo)

---

**🛠️ Master Azimov - Manual de Operações Completo**
