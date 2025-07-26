#!/bin/bash

# Master Azimov - Monitoring Setup Script
# Este script configura e inicia todo o stack de monitoramento

set -e

echo "🚀 Master Azimov - Monitoring Setup"
echo "=================================="

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

# Verificar se Docker está rodando
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        error "Docker não está rodando. Inicie o Docker e tente novamente."
        exit 1
    fi
    log "Docker está rodando ✓"
}

# Verificar se Docker Compose está disponível
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose não está instalado."
        exit 1
    fi
    log "Docker Compose está disponível ✓"
}

# Criar diretórios necessários
create_directories() {
    log "Criando diretórios necessários..."
    
    mkdir -p logs/nginx
    mkdir -p logs/nestjs
    mkdir -p logs/postgres
    mkdir -p logs/redis
    mkdir -p data/prometheus
    mkdir -p data/grafana
    mkdir -p data/elasticsearch
    
    # Definir permissões corretas
    sudo chown -R 1000:1000 data/grafana
    sudo chown -R 1000:1000 data/elasticsearch
    
    log "Diretórios criados ✓"
}

# Configurar limites do sistema para Elasticsearch
configure_system() {
    log "Configurando limites do sistema para Elasticsearch..."
    
    # Aumentar vm.max_map_count
    if [ "$(sysctl -n vm.max_map_count)" -lt 262144 ]; then
        sudo sysctl -w vm.max_map_count=262144
        echo "vm.max_map_count=262144" | sudo tee -a /etc/sysctl.conf
        log "vm.max_map_count configurado ✓"
    else
        log "vm.max_map_count já está configurado ✓"
    fi
}

# Iniciar serviços
start_services() {
    log "Iniciando serviços de monitoramento..."
    
    # Parar serviços existentes
    docker-compose down --remove-orphans
    
    # Iniciar serviços em ordem específica
    log "Iniciando Elasticsearch..."
    docker-compose up -d elasticsearch
    sleep 30
    
    log "Iniciando Logstash..."
    docker-compose up -d logstash
    sleep 20
    
    log "Iniciando Kibana..."
    docker-compose up -d kibana
    sleep 15
    
    log "Iniciando Prometheus e Grafana..."
    docker-compose up -d prometheus grafana
    sleep 10
    
    log "Iniciando exporters e coletores..."
    docker-compose up -d node-exporter cadvisor filebeat
    sleep 10
    
    log "Iniciando AlertManager e Jaeger..."
    docker-compose up -d alertmanager jaeger
    
    log "Todos os serviços iniciados ✓"
}

# Verificar status dos serviços
check_services() {
    log "Verificando status dos serviços..."
    
    services=("elasticsearch" "prometheus" "grafana" "kibana" "logstash" "filebeat" "alertmanager" "jaeger")
    
    for service in "${services[@]}"; do
        if docker-compose ps | grep -q "$service.*Up"; then
            log "$service está rodando ✓"
        else
            warn "$service não está rodando"
        fi
    done
}

# Mostrar URLs de acesso
show_urls() {
    echo ""
    echo -e "${BLUE}🌐 URLs de Acesso:${NC}"
    echo "=================================="
    echo -e "${GREEN}Grafana:${NC}       http://localhost:3030 (admin/admin123)"
    echo -e "${GREEN}Prometheus:${NC}    http://localhost:9090"
    echo -e "${GREEN}Kibana:${NC}        http://localhost:5601"
    echo -e "${GREEN}AlertManager:${NC}  http://localhost:9093"
    echo -e "${GREEN}Jaeger:${NC}        http://localhost:16686"
    echo -e "${GREEN}cAdvisor:${NC}      http://localhost:8080"
    echo -e "${GREEN}Elasticsearch:${NC} http://localhost:9200"
    echo ""
}

# Função principal
main() {
    log "Iniciando setup do monitoramento..."
    
    check_docker
    check_docker_compose
    create_directories
    configure_system
    start_services
    sleep 10
    check_services
    show_urls
    
    log "Setup concluído! 🎉"
    log "Aguarde alguns minutos para todos os serviços estarem completamente operacionais."
}

# Executar função principal
main "$@"
