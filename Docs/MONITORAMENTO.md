# Master Azimov - Sistema de Monitoramento e Logging

## 📊 Visão Geral

O sistema de monitoramento do Master Azimov fornece observabilidade completa da aplicação através de métricas, logs, alertas e tracing distribuído.

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Aplicação     │    │   Monitoring    │    │   Visualização  │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │  NestJS     │ │───▶│ │ Prometheus  │ │───▶│ │   Grafana   │ │
│ │   API       │ │    │ │   (Métricas)│ │    │ │(Dashboards) │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ PostgreSQL  │ │───▶│ │   Filebeat  │ │───▶│ │   Kibana    │ │
│ │   Redis     │ │    │ │  (Logs)     │ │    │ │  (Logs)     │ │
│ │   Nginx     │ │    │ │             │ │    │ │             │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│                 │    │       │         │    │                 │
└─────────────────┘    │       ▼         │    └─────────────────┘
                       │ ┌─────────────┐ │
                       │ │  Logstash   │ │
                       │ │(Processar)  │ │
                       │ └─────────────┘ │
                       │       │         │
                       │       ▼         │
                       │ ┌─────────────┐ │
                       │ │Elasticsearch│ │
                       │ │(Armazenar)  │ │
                       │ └─────────────┘ │
                       └─────────────────┘
```

## 🚀 Setup Rápido

### 1. Configuração Inicial
```bash
cd Monitor
cp .env.example .env
# Edite o .env com suas configurações
```

### 2. Iniciar Sistema
```bash
./scripts/setup.sh
```

### 3. Verificar Status
```bash
./scripts/health-check.sh
```

## 🌐 Acessos

| Serviço | URL | Função |
|---------|-----|--------|
| Grafana | http://localhost:3030 | Dashboards e métricas |
| Prometheus | http://localhost:9090 | Coleta de métricas |
| Kibana | http://localhost:5601 | Análise de logs |
| AlertManager | http://localhost:9093 | Gestão de alertas |
| Jaeger | http://localhost:16686 | Tracing distribuído |

## 📈 Dashboards Principais

### 1. System Overview
- CPU, memória, disco do sistema
- Status dos containers
- Network I/O

### 2. Application Metrics
- Requisições HTTP (rate, latência, status)
- Performance da API
- Conexões de banco

### 3. Database Monitoring
- PostgreSQL performance
- Conexões ativas
- Query analytics

### 4. Cache Monitoring
- Redis metrics
- Hit/miss ratio
- Memory usage

## 🔔 Alertas Configurados

### Sistema
- ⚠️ CPU > 80% por 5 min
- ⚠️ Memória > 85% por 5 min  
- 🚨 Disco > 90%

### Aplicação
- 🚨 Backend offline
- 🚨 Database offline
- ⚠️ Tempo resposta > 1s
- ⚠️ Taxa erro > 5%

### Containers
- 🚨 Container parado
- ⚠️ Alto uso CPU/memória

## 📋 Logs Estruturados

### Formato Padrão
```json
{
  "@timestamp": "2025-01-20T10:30:00Z",
  "level": "info",
  "service": "nestjs-backend",
  "environment": "production",
  "message": "User authenticated successfully",
  "user_id": "123",
  "correlation_id": "abc-def-123"
}
```

### Tipos de Logs
- **Application** - Logs da aplicação NestJS
- **Database** - PostgreSQL logs
- **Cache** - Redis logs  
- **Proxy** - Nginx access/error logs
- **System** - OS e container logs

## 🛠️ Comandos Úteis

### Gerenciamento
```bash
# Setup completo
./scripts/setup.sh

# Health check
./scripts/health-check.sh

# Backup dados
./scripts/backup-logs.sh backup

# Ver logs específicos
docker-compose logs -f prometheus
docker-compose logs -f grafana
```

### Troubleshooting
```bash
# Verificar containers
docker-compose ps

# Restart serviço específico
docker-compose restart prometheus

# Ver uso de recursos
docker stats

# Limpar dados (CUIDADO!)
docker-compose down -v
```

## 📊 Métricas Importantes

### Performance
- `http_request_duration_seconds` - Latência das requisições
- `http_requests_total` - Total de requisições
- `nodejs_heap_used_bytes` - Uso de memória Node.js

### Sistema
- `node_cpu_seconds_total` - CPU usage
- `node_memory_MemAvailable_bytes` - Memória disponível
- `node_filesystem_free_bytes` - Espaço em disco

### Database
- `postgres_up` - Status PostgreSQL
- `postgres_connections_active` - Conexões ativas
- `postgres_slow_queries_total` - Queries lentas

### Cache
- `redis_up` - Status Redis
- `redis_memory_used_bytes` - Memória usada
- `redis_commands_total` - Comandos executados

## 🔧 Customização

### Adicionar Nova Métrica
1. Expor métrica na aplicação:
```typescript
// NestJS
@Get('/metrics')
async getMetrics() {
  return register.metrics();
}
```

2. Configurar coleta no Prometheus:
```yaml
# prometheus.yml
- job_name: 'my-service'
  static_configs:
    - targets: ['my-service:8080']
```

### Criar Dashboard Grafana
1. Acessar Grafana (localhost:3030)
2. Import dashboard ou criar novo
3. Adicionar painéis com queries PromQL
4. Salvar JSON em `grafana/dashboards/`

### Configurar Alerta
1. Criar regra em `prometheus/rules/`:
```yaml
- alert: HighLatency
  expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
  for: 2m
  annotations:
    summary: "High latency detected"
```

2. Configurar notificação no AlertManager

## 🔒 Segurança

### Produção
- Alterar senhas padrão
- Configurar HTTPS
- Restringir acessos por IP
- Usar autenticação externa

### Backup
- Dados em volumes Docker
- Backup automático via script
- Retenção configurável
- Restore procedures

## 📚 Referências

- [Prometheus Best Practices](https://prometheus.io/docs/practices/naming/)
- [Grafana Dashboard Design](https://grafana.com/docs/grafana/latest/best-practices/)
- [ELK Stack Guide](https://www.elastic.co/guide/en/elastic-stack/current/index.html)
- [Monitoring Microservices](https://microservices.io/patterns/observability/application-metrics.html)

---

Para mais detalhes, consulte o [`Monitor/README.md`](../Monitor/README.md) completo.
