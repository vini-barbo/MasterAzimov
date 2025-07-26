#!/bin/bash

# Master Azimov - Script de Gerenciamento dos Ambientes
# Este script facilita o gerenciamento dos ambientes dev e prod

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções de log
log() { echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"; }
warn() { echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"; }
error() { echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"; }

# Verificar se arquivo .env existe
check_env_file() {
    if [ ! -f .env ]; then
        warn "Arquivo .env não encontrado. Criando a partir do .env.example..."
        cp .env.example .env
        warn "Por favor, configure as variáveis no arquivo .env antes de continuar"
        exit 1
    fi
}

# Função para desenvolvimento
start_dev() {
    log "🚀 Iniciando ambiente de DESENVOLVIMENTO..."
    check_env_file
    
    # Apenas serviços essenciais para desenvolvimento
    docker-compose -f compose.yaml up -d database redis backend
    
    log "Aguardando serviços ficarem prontos..."
    sleep 10
    
    # Iniciar monitoramento básico
    log "Iniciando monitoramento básico..."
    docker-compose -f compose.yaml up -d prometheus grafana node-exporter cadvisor
    
    log "✅ Ambiente de desenvolvimento iniciado!"
    log "📊 Grafana: http://localhost:3030 (admin/admin123)"
    log "🔍 Prometheus: http://localhost:9090"
    log "🚀 Backend: http://localhost:3000"
}

# Função para desenvolvimento completo
start_dev_full() {
    log "🚀 Iniciando ambiente de DESENVOLVIMENTO COMPLETO (com logging)..."
    check_env_file
    
    docker-compose -f compose.yaml --profile full-monitoring up -d
    
    log "✅ Ambiente de desenvolvimento completo iniciado!"
    log "📊 Grafana: http://localhost:3030 (admin/admin123)"
    log "🔍 Prometheus: http://localhost:9090"
    log "📋 Kibana: http://localhost:5601"
    log "🔍 Elasticsearch: http://localhost:9200"
    log "🚀 Backend: http://localhost:3000"
}

# Função para produção
start_prod() {
    log "🚀 Iniciando ambiente de PRODUÇÃO..."
    check_env_file
    
    # Verificar variáveis críticas
    source .env
    if [ -z "$POSTGRES_PASSWORD" ] || [ -z "$JWT_SECRET" ] || [ -z "$GRAFANA_ADMIN_PASSWORD" ]; then
        error "Variáveis críticas não configuradas no .env!"
        error "Configure: POSTGRES_PASSWORD, JWT_SECRET, GRAFANA_ADMIN_PASSWORD"
        exit 1
    fi
    
    docker-compose -f compose.prod.yaml up -d
    
    log "✅ Ambiente de produção iniciado!"
    log "📊 Grafana: http://localhost:3030"
    log "🔍 Prometheus: http://localhost:9090"
    log "📋 Kibana: http://localhost:5601"
    log "🔔 AlertManager: http://localhost:9093"
    log "🔗 Jaeger: http://localhost:16686"
    log "🚀 Backend: http://localhost:3000"
}

# Parar serviços
stop_dev() {
    log "🛑 Parando ambiente de desenvolvimento..."
    docker-compose -f compose.yaml down
    log "✅ Ambiente de desenvolvimento parado"
}

stop_prod() {
    log "🛑 Parando ambiente de produção..."
    docker-compose -f compose.prod.yaml down
    log "✅ Ambiente de produção parado"
}

# Status dos serviços
status() {
    echo -e "${BLUE}📊 Status dos Serviços${NC}"
    echo "===================="
    
    echo -e "${GREEN}Desenvolvimento:${NC}"
    docker-compose -f compose.yaml ps
    
    echo ""
    echo -e "${GREEN}Produção:${NC}"
    docker-compose -f compose.prod.yaml ps
}

# Logs
logs_dev() {
    local service=${1:-}
    if [ -n "$service" ]; then
        docker-compose -f compose.yaml logs -f "$service"
    else
        docker-compose -f compose.yaml logs -f
    fi
}

logs_prod() {
    local service=${1:-}
    if [ -n "$service" ]; then
        docker-compose -f compose.prod.yaml logs -f "$service"
    else
        docker-compose -f compose.prod.yaml logs -f
    fi
}

# Health check
health_check() {
    log "🏥 Verificando saúde dos serviços..."
    
    # Executar health check do Monitor se existir
    if [ -f "./Monitor/scripts/health-check.sh" ]; then
        ./Monitor/scripts/health-check.sh
    else
        # Health check básico
        echo "Verificando serviços principais..."
        
        # Backend
        if curl -s -f http://localhost:3000/health > /dev/null; then
            echo "✅ Backend OK"
        else
            echo "❌ Backend com problemas"
        fi
        
        # Grafana
        if curl -s -f http://localhost:3030/api/health > /dev/null; then
            echo "✅ Grafana OK"
        else
            echo "❌ Grafana com problemas"
        fi
        
        # Prometheus
        if curl -s -f http://localhost:9090/-/healthy > /dev/null; then
            echo "✅ Prometheus OK"
        else
            echo "❌ Prometheus com problemas"
        fi
    fi
}

# Backup
backup() {
    log "💾 Iniciando backup..."
    
    if [ -f "./Monitor/scripts/backup-logs.sh" ]; then
        ./Monitor/scripts/backup-logs.sh backup
    else
        warn "Script de backup não encontrado. Fazendo backup básico..."
        
        # Backup básico dos volumes
        local backup_dir="./backups/$(date +%Y%m%d-%H%M%S)"
        mkdir -p "$backup_dir"
        
        docker run --rm -v master-azimov_postgres_data_prod:/data -v "$backup_dir":/backup alpine tar czf /backup/postgres.tar.gz -C /data .
        docker run --rm -v master-azimov_grafana_data_prod:/data -v "$backup_dir":/backup alpine tar czf /backup/grafana.tar.gz -C /data .
        
        log "Backup salvo em: $backup_dir"
    fi
}

# Limpeza
cleanup() {
    log "🧹 Limpando recursos não utilizados..."
    
    docker system prune -f
    docker volume prune -f
    
    log "✅ Limpeza concluída"
}

# Menu de ajuda
show_help() {
    echo -e "${BLUE}Master Azimov - Gerenciamento de Ambientes${NC}"
    echo "==========================================="
    echo ""
    echo "Uso: $0 <comando> [opções]"
    echo ""
    echo "Comandos disponíveis:"
    echo ""
    echo -e "${GREEN}Desenvolvimento:${NC}"
    echo "  dev             - Iniciar ambiente dev (básico)"
    echo "  dev-full        - Iniciar ambiente dev completo (com ELK)"
    echo "  stop-dev        - Parar ambiente de desenvolvimento"
    echo "  logs-dev [svc]  - Ver logs do desenvolvimento"
    echo ""
    echo -e "${GREEN}Produção:${NC}"
    echo "  prod            - Iniciar ambiente de produção"
    echo "  stop-prod       - Parar ambiente de produção"
    echo "  logs-prod [svc] - Ver logs da produção"
    echo ""
    echo -e "${GREEN}Gerais:${NC}"
    echo "  status          - Status de todos os serviços"
    echo "  health          - Health check dos serviços"
    echo "  backup          - Fazer backup dos dados"
    echo "  cleanup         - Limpar recursos não utilizados"
    echo ""
    echo -e "${GREEN}Exemplos:${NC}"
    echo "  $0 dev                    # Iniciar desenvolvimento"
    echo "  $0 prod                   # Iniciar produção"
    echo "  $0 logs-dev backend       # Ver logs do backend (dev)"
    echo "  $0 health                 # Verificar saúde"
    echo ""
}

# Função principal
main() {
    case "${1:-help}" in
        "dev")
            start_dev
            ;;
        "dev-full")
            start_dev_full
            ;;
        "prod")
            start_prod
            ;;
        "stop-dev")
            stop_dev
            ;;
        "stop-prod")
            stop_prod
            ;;
        "status")
            status
            ;;
        "logs-dev")
            logs_dev "$2"
            ;;
        "logs-prod")
            logs_prod "$2"
            ;;
        "health")
            health_check
            ;;
        "backup")
            backup
            ;;
        "cleanup")
            cleanup
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Executar
main "$@"
