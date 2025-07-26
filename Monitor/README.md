# Master Azimov - Sistema de Monitoramento e Logging

Este diretório contém uma solução completa de monitoramento e logging para o projeto Master Azimov, incluindo métricas, logs, alertas e tracing distribuído.

## 📊 Componentes do Sistema

### 🔍 **Monitoramento de Métricas**
- **Prometheus** - Coleta e armazenamento de métricas
- **Grafana** - Visualização e dashboards
- **Node Exporter** - Métricas do sistema operacional
- **cAdvisor** - Métricas de containers Docker
- **AlertManager** - Gerenciamento de alertas

### 📋 **Logging e Análise de Logs**
- **Elasticsearch** - Armazenamento e indexação de logs
- **Logstash** - Processamento e transformação de logs
- **Kibana** - Visualização e análise de logs
- **Filebeat** - Coleta de logs dos containers

### 🔗 **Tracing Distribuído**
- **Jaeger** - Rastreamento de requisições distribuídas

## 🚀 Como Usar

### ⚡ Setup Rápido

```bash
# 1. Navegar para o diretório do Monitor
cd Monitor

# 2. Executar o script de setup
./scripts/setup.sh

# 3. Verificar se tudo está funcionando
./scripts/health-check.sh
```

### 🔧 Comandos Manuais

```bash
# Iniciar todos os serviços
docker-compose up -d

# Iniciar serviços específicos
docker-compose up -d prometheus grafana
docker-compose up -d elasticsearch kibana logstash

# Parar todos os serviços
docker-compose down

# Ver logs de um serviço
docker-compose logs -f prometheus
```

## 🌐 URLs de Acesso

| Serviço | URL | Credenciais |
|---------|-----|-------------|
| **Grafana** | http://localhost:3030 | admin / admin123 |
| **Prometheus** | http://localhost:9090 | - |
| **Kibana** | http://localhost:5601 | - |
| **AlertManager** | http://localhost:9093 | - |
| **Jaeger** | http://localhost:16686 | - |
| **cAdvisor** | http://localhost:8080 | - |
| **Elasticsearch** | http://localhost:9200 | - |

## 📈 Dashboards e Visualizações

### Grafana Dashboards Incluídos:
- **System Overview** - Visão geral do sistema (CPU, memória, rede)
- **Application Metrics** - Métricas da aplicação NestJS
- **Database Monitoring** - Monitoramento do PostgreSQL
- **Redis Monitoring** - Métricas do cache Redis
- **Container Monitoring** - Métricas dos containers Docker

### Kibana Visualizações:
- **Application Logs** - Logs da aplicação
- **Error Analysis** - Análise de erros
- **Performance Logs** - Logs de performance
- **Security Logs** - Logs de segurança

## 🔔 Alertas Configurados

### Alertas de Sistema:
- CPU > 80% por 5 minutos
- Memória > 85% por 5 minutos
- Disco > 90%
- Container parado/morto

### Alertas de Aplicação:
- Serviço backend offline
- Database offline
- Redis offline
- Alto tempo de resposta (>1s)
- Alta taxa de erro (>5%)

### Alertas de Container:
- Container com alto uso de CPU
- Container com alto uso de memória
- Container reiniciado

## 📁 Estrutura do Diretório

```
Monitor/
├── docker-compose.yml           # Configuração principal dos serviços
├── prometheus/                  # Configurações do Prometheus
│   ├── prometheus.yml          # Configuração principal
│   └── rules/                  # Regras de alerta
│       └── alerts.yml
├── grafana/                    # Configurações do Grafana
│   ├── provisioning/           # Datasources e dashboards
│   └── dashboards/             # Dashboards em JSON
├── logstash/                   # Configurações do Logstash
│   ├── config/
│   └── pipeline/
├── filebeat/                   # Configuração do Filebeat
│   └── filebeat.yml
├── alertmanager/               # Configuração do AlertManager
│   └── alertmanager.yml
└── scripts/                    # Scripts de gerenciamento
    ├── setup.sh               # Setup inicial
    ├── health-check.sh         # Verificação de saúde
    └── backup-logs.sh          # Backup e logs
```

## 🛠️ Scripts de Gerenciamento

### 🔧 Setup Inicial
```bash
./scripts/setup.sh
```
- Configura o sistema
- Inicia todos os serviços
- Verifica se tudo está funcionando

### 🏥 Health Check
```bash
./scripts/health-check.sh          # Verificação completa
./scripts/health-check.sh elastic  # Apenas ELK Stack
./scripts/health-check.sh prom     # Apenas Prometheus/Grafana
```

### 💾 Backup e Logs
```bash
./scripts/backup-logs.sh backup    # Fazer backup
./scripts/backup-logs.sh logs      # Rotacionar logs
./scripts/backup-logs.sh all       # Todas as operações
```

## 📊 Métricas Coletadas

### Sistema:
- CPU, Memória, Disco, Rede
- Load average, Uptime
- Processos, File descriptors

### Aplicação (NestJS):
- Requisições HTTP (rate, duration, status)
- Conexões de database
- Cache hits/misses
- Heap memory usage

### Database (PostgreSQL):
- Conexões ativas
- Query performance
- Locks, deadlocks
- Disk usage

### Cache (Redis):
- Comandos executados
- Memory usage
- Hit ratio
- Connected clients

### Containers:
- CPU e Memory usage
- Network I/O
- Disk I/O
- Container status

## 📋 Logs Coletados

### Tipos de Logs:
- **Application logs** - Logs da aplicação NestJS
- **Database logs** - Logs do PostgreSQL
- **Cache logs** - Logs do Redis
- **Nginx logs** - Logs do proxy reverso
- **System logs** - Logs do sistema operacional
- **Container logs** - Logs dos containers Docker

### Formatação:
- Logs estruturados em JSON
- Timestamps padronizados
- Campos de contexto (service, environment, etc.)
- Correlation IDs para tracing

## 🔧 Configuração Avançada

### Prometheus Targets:
Edite `prometheus/prometheus.yml` para adicionar novos targets:

```yaml
scrape_configs:
  - job_name: 'new-service'
    static_configs:
      - targets: ['localhost:9999']
```

### Grafana Datasources:
Adicione em `grafana/provisioning/datasources/`:

```yaml
- name: MyDataSource
  type: prometheus
  url: http://my-prometheus:9090
```

### Logstash Pipelines:
Adicione novos pipelines em `logstash/pipeline/`:

```ruby
input {
  # sua configuração
}
filter {
  # seus filtros
}
output {
  # sua saída
}
```

## 🚨 Troubleshooting

### Elasticsearch não inicia:
```bash
# Verificar vm.max_map_count
sysctl vm.max_map_count

# Configurar se necessário
sudo sysctl -w vm.max_map_count=262144
```

### Prometheus não encontra targets:
```bash
# Verificar conectividade
curl http://localhost:3000/api/metrics

# Verificar configuração
docker exec azimov-prometheus cat /etc/prometheus/prometheus.yml
```

### Grafana não mostra dados:
1. Verificar se o datasource está configurado
2. Verificar se o Prometheus está coletando métricas
3. Verificar as queries nos dashboards

### Kibana não mostra logs:
1. Verificar se o Filebeat está enviando logs
2. Verificar se o Logstash está processando
3. Verificar índices no Elasticsearch

## 📚 Recursos Adicionais

### Documentação:
- [Prometheus Docs](https://prometheus.io/docs/)
- [Grafana Docs](https://grafana.com/docs/)
- [ELK Stack Docs](https://www.elastic.co/guide/)
- [Jaeger Docs](https://www.jaegertracing.io/docs/)

### Dashboards Adicionais:
- [Grafana Dashboard Library](https://grafana.com/grafana/dashboards/)
- [Awesome Prometheus Alerts](https://awesome-prometheus-alerts.grep.to/)

## 🔒 Segurança

### Configurações de Segurança:
- Altere as senhas padrão
- Configure HTTPS para produção
- Restrinja acesso por IP se necessário
- Use autenticação externa (LDAP, OAuth)

### Variáveis de Ambiente:
```bash
# Grafana
GF_SECURITY_ADMIN_PASSWORD=sua-senha-forte

# AlertManager SMTP
SMTP_AUTH_PASSWORD=sua-senha-email
```

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique os logs: `docker-compose logs [service]`
2. Execute o health check: `./scripts/health-check.sh`
3. Consulte a documentação oficial dos componentes
4. Abra uma issue no repositório do projeto

---

**Monitoramento é fundamental para a operação confiável do sistema Master Azimov! 🚀**
