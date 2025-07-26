#!/bin/bash

# Master Azimov - Monitoring Health Check Script
# Este script verifica a saúde de todos os serviços de monitoramento

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

success() {
    echo -e "${GREEN}✓ $1${NC}"
}

fail() {
    echo -e "${RED}✗ $1${NC}"
}

# Verificar conectividade HTTP
check_http() {
    local url=$1
    local service_name=$2
    local timeout=${3:-10}
    
    if curl -s --max-time $timeout "$url" > /dev/null 2>&1; then
        success "$service_name está respondendo ($url)"
        return 0
    else
        fail "$service_name não está respondendo ($url)"
        return 1
    fi
}

# Verificar status do container
check_container() {
    local container_name=$1
    
    if docker ps --format "table {{.Names}}\t{{.Status}}" | grep -q "$container_name.*Up"; then
        success "Container $container_name está rodando"
        return 0
    else
        fail "Container $container_name não está rodando ou não existe"
        return 1
    fi
}

# Verificar Elasticsearch
check_elasticsearch() {
    log "Verificando Elasticsearch..."
    
    if check_container "azimov-elasticsearch"; then
        if check_http "http://localhost:9200/_cluster/health" "Elasticsearch API"; then
            # Verificar índices
            local indices=$(curl -s "http://localhost:9200/_cat/indices?v" 2>/dev/null | wc -l)
            if [ "$indices" -gt 1 ]; then
                success "Elasticsearch tem $(($indices - 1)) índices"
            else
                warn "Elasticsearch não tem índices ainda"
            fi
        fi
    fi
}

# Verificar Kibana
check_kibana() {
    log "Verificando Kibana..."
    
    if check_container "azimov-kibana"; then
        check_http "http://localhost:5601/api/status" "Kibana" 30
    fi
}

# Verificar Logstash
check_logstash() {
    log "Verificando Logstash..."
    
    if check_container "azimov-logstash"; then
        check_http "http://localhost:9600" "Logstash API"
    fi
}

# Verificar Prometheus
check_prometheus() {
    log "Verificando Prometheus..."
    
    if check_container "azimov-prometheus"; then
        if check_http "http://localhost:9090/-/healthy" "Prometheus"; then
            # Verificar targets
            local targets=$(curl -s "http://localhost:9090/api/v1/targets" 2>/dev/null | jq -r '.data.activeTargets | length' 2>/dev/null || echo "0")
            success "Prometheus tem $targets targets ativos"
        fi
    fi
}

# Verificar Grafana
check_grafana() {
    log "Verificando Grafana..."
    
    if check_container "azimov-grafana"; then
        if check_http "http://localhost:3030/api/health" "Grafana"; then
            # Verificar datasources
            local datasources=$(curl -s -u admin:admin123 "http://localhost:3030/api/datasources" 2>/dev/null | jq -r 'length' 2>/dev/null || echo "0")
            success "Grafana tem $datasources datasources configurados"
        fi
    fi
}

# Verificar AlertManager
check_alertmanager() {
    log "Verificando AlertManager..."
    
    if check_container "azimov-alertmanager"; then
        check_http "http://localhost:9093/-/healthy" "AlertManager"
    fi
}

# Verificar Jaeger
check_jaeger() {
    log "Verificando Jaeger..."
    
    if check_container "azimov-jaeger"; then
        check_http "http://localhost:16686/" "Jaeger UI"
    fi
}

# Verificar exporters
check_exporters() {
    log "Verificando exporters..."
    
    check_container "azimov-node-exporter"
    check_http "http://localhost:9100/metrics" "Node Exporter"
    
    check_container "azimov-cadvisor"
    check_http "http://localhost:8080/metrics" "cAdvisor"
}

# Verificar Filebeat
check_filebeat() {
    log "Verificando Filebeat..."
    check_container "azimov-filebeat"
}

# Mostrar resumo do sistema
show_system_summary() {
    echo ""
    echo -e "${BLUE}📊 Resumo do Sistema:${NC}"
    echo "===================="
    
    # Docker info
    echo -e "${GREEN}Docker:${NC}"
    docker system df --format "table {{.Type}}\t{{.Total}}\t{{.Active}}\t{{.Size}}"
    
    echo ""
    echo -e "${GREEN}Containers em execução:${NC}"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep azimov
    
    echo ""
    echo -e "${GREEN}Uso de recursos:${NC}"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" | grep azimov | head -10
}

# Função principal
main() {
    echo -e "${BLUE}🔍 Master Azimov - Health Check${NC}"
    echo "================================"
    echo ""
    
    check_elasticsearch
    echo ""
    check_kibana
    echo ""
    check_logstash
    echo ""
    check_prometheus
    echo ""
    check_grafana
    echo ""
    check_alertmanager
    echo ""
    check_jaeger
    echo ""
    check_exporters
    echo ""
    check_filebeat
    echo ""
    
    show_system_summary
    
    echo ""
    log "Health check concluído! 🏁"
}

# Executar com argumentos opcionais
case "${1:-all}" in
    "elastic"|"elk")
        check_elasticsearch
        check_kibana
        check_logstash
        check_filebeat
        ;;
    "prometheus"|"prom")
        check_prometheus
        check_grafana
        check_alertmanager
        ;;
    "exporters")
        check_exporters
        ;;
    "jaeger"|"tracing")
        check_jaeger
        ;;
    "summary")
        show_system_summary
        ;;
    *)
        main
        ;;
esac
