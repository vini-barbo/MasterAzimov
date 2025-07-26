#!/bin/bash

# Master Azimov - Backup and Logs Management Script
# Este script gerencia backups e logs do sistema de monitoramento

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
BACKUP_DIR="./backups"
LOG_DIR="./logs"
RETENTION_DAYS=30

# Funções de log
log() { echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"; }
warn() { echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"; }
error() { echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"; }

# Criar diretórios de backup
create_backup_dirs() {
    mkdir -p "$BACKUP_DIR"/{prometheus,grafana,elasticsearch,configs}
    log "Diretórios de backup criados"
}

# Backup do Prometheus
backup_prometheus() {
    log "Fazendo backup do Prometheus..."
    
    local backup_file="$BACKUP_DIR/prometheus/prometheus-$(date +%Y%m%d-%H%M%S).tar.gz"
    
    if docker exec azimov-prometheus tar czf - /prometheus > "$backup_file" 2>/dev/null; then
        log "Backup do Prometheus salvo: $backup_file"
    else
        error "Falha no backup do Prometheus"
    fi
}

# Backup do Grafana
backup_grafana() {
    log "Fazendo backup do Grafana..."
    
    local backup_file="$BACKUP_DIR/grafana/grafana-$(date +%Y%m%d-%H%M%S).tar.gz"
    
    if docker exec azimov-grafana tar czf - /var/lib/grafana > "$backup_file" 2>/dev/null; then
        log "Backup do Grafana salvo: $backup_file"
    else
        error "Falha no backup do Grafana"
    fi
}

# Backup do Elasticsearch
backup_elasticsearch() {
    log "Fazendo backup do Elasticsearch..."
    
    local backup_file="$BACKUP_DIR/elasticsearch/elasticsearch-$(date +%Y%m%d-%H%M%S).tar.gz"
    
    # Criar snapshot via API
    curl -X PUT "localhost:9200/_snapshot/backup/snapshot_$(date +%Y%m%d_%H%M%S)" \
         -H 'Content-Type: application/json' \
         -d '{"indices": "*", "ignore_unavailable": true, "include_global_state": false}' \
         2>/dev/null
    
    # Backup dos dados
    if docker exec azimov-elasticsearch tar czf - /usr/share/elasticsearch/data > "$backup_file" 2>/dev/null; then
        log "Backup do Elasticsearch salvo: $backup_file"
    else
        error "Falha no backup do Elasticsearch"
    fi
}

# Backup das configurações
backup_configs() {
    log "Fazendo backup das configurações..."
    
    local backup_file="$BACKUP_DIR/configs/configs-$(date +%Y%m%d-%H%M%S).tar.gz"
    
    tar czf "$backup_file" \
        prometheus/ \
        grafana/ \
        logstash/ \
        filebeat/ \
        alertmanager/ \
        docker-compose.yml \
        2>/dev/null
    
    log "Backup das configurações salvo: $backup_file"
}

# Limpeza de backups antigos
cleanup_old_backups() {
    log "Limpando backups antigos (>${RETENTION_DAYS} dias)..."
    
    find "$BACKUP_DIR" -type f -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete
    
    log "Limpeza de backups concluída"
}

# Rotação de logs
rotate_logs() {
    log "Rotacionando logs..."
    
    # Logs do Docker
    docker logs azimov-prometheus > "$LOG_DIR/prometheus-$(date +%Y%m%d).log" 2>&1 || true
    docker logs azimov-grafana > "$LOG_DIR/grafana-$(date +%Y%m%d).log" 2>&1 || true
    docker logs azimov-elasticsearch > "$LOG_DIR/elasticsearch-$(date +%Y%m%d).log" 2>&1 || true
    docker logs azimov-kibana > "$LOG_DIR/kibana-$(date +%Y%m%d).log" 2>&1 || true
    docker logs azimov-logstash > "$LOG_DIR/logstash-$(date +%Y%m%d).log" 2>&1 || true
    
    # Comprimir logs antigos
    find "$LOG_DIR" -name "*.log" -mtime +1 -exec gzip {} \;
    
    # Limpar logs muito antigos
    find "$LOG_DIR" -name "*.log.gz" -mtime +$RETENTION_DAYS -delete
    
    log "Rotação de logs concluída"
}

# Exportar métricas
export_metrics() {
    log "Exportando métricas..."
    
    local metrics_file="$BACKUP_DIR/metrics-$(date +%Y%m%d-%H%M%S).json"
    
    # Exportar algumas métricas importantes do Prometheus
    curl -s "http://localhost:9090/api/v1/query?query=up" > "$metrics_file.up"
    curl -s "http://localhost:9090/api/v1/query?query=node_load1" > "$metrics_file.load"
    curl -s "http://localhost:9090/api/v1/query?query=node_memory_MemAvailable_bytes" > "$metrics_file.memory"
    
    # Combinar em um arquivo JSON
    echo "{" > "$metrics_file"
    echo "  \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"," >> "$metrics_file"
    echo "  \"up\": $(cat "$metrics_file.up")," >> "$metrics_file"
    echo "  \"load\": $(cat "$metrics_file.load")," >> "$metrics_file"
    echo "  \"memory\": $(cat "$metrics_file.memory")" >> "$metrics_file"
    echo "}" >> "$metrics_file"
    
    # Limpar arquivos temporários
    rm -f "$metrics_file".{up,load,memory}
    
    log "Métricas exportadas: $metrics_file"
}

# Gerar relatório de status
generate_status_report() {
    log "Gerando relatório de status..."
    
    local report_file="$BACKUP_DIR/status-report-$(date +%Y%m%d-%H%M%S).txt"
    
    {
        echo "Master Azimov - Status Report"
        echo "============================="
        echo "Data: $(date)"
        echo ""
        
        echo "CONTAINERS:"
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep azimov
        echo ""
        
        echo "USO DE RECURSOS:"
        docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" | grep azimov
        echo ""
        
        echo "VOLUMES:"
        docker volume ls | grep azimov
        echo ""
        
        echo "ESPAÇO EM DISCO:"
        df -h | grep -E "(/$|/var)"
        echo ""
        
        echo "TARGETS PROMETHEUS:"
        curl -s "http://localhost:9090/api/v1/targets" | jq -r '.data.activeTargets[] | "\(.labels.job): \(.health)"' 2>/dev/null || echo "Prometheus não disponível"
        echo ""
        
        echo "INDICES ELASTICSEARCH:"
        curl -s "http://localhost:9200/_cat/indices?v" 2>/dev/null || echo "Elasticsearch não disponível"
        
    } > "$report_file"
    
    log "Relatório de status salvo: $report_file"
}

# Mostrar estatísticas
show_stats() {
    echo -e "${BLUE}📊 Estatísticas do Sistema de Monitoramento${NC}"
    echo "============================================="
    
    echo -e "${GREEN}Backups:${NC}"
    find "$BACKUP_DIR" -name "*.tar.gz" -exec ls -lh {} \; | tail -10
    
    echo ""
    echo -e "${GREEN}Logs:${NC}"
    find "$LOG_DIR" -name "*.log*" -exec ls -lh {} \; | tail -10
    
    echo ""
    echo -e "${GREEN}Espaço usado pelos dados:${NC}"
    docker system df
}

# Função principal
main() {
    case "${1:-all}" in
        "backup")
            create_backup_dirs
            backup_prometheus
            backup_grafana
            backup_elasticsearch
            backup_configs
            cleanup_old_backups
            ;;
        "logs")
            rotate_logs
            ;;
        "metrics")
            export_metrics
            ;;
        "report")
            generate_status_report
            ;;
        "cleanup")
            cleanup_old_backups
            rotate_logs
            ;;
        "stats")
            show_stats
            ;;
        "all")
            create_backup_dirs
            backup_prometheus
            backup_grafana
            backup_elasticsearch
            backup_configs
            rotate_logs
            export_metrics
            generate_status_report
            cleanup_old_backups
            ;;
        *)
            echo "Uso: $0 {backup|logs|metrics|report|cleanup|stats|all}"
            echo ""
            echo "Comandos:"
            echo "  backup  - Fazer backup de todos os dados"
            echo "  logs    - Rotacionar logs"
            echo "  metrics - Exportar métricas"
            echo "  report  - Gerar relatório de status"
            echo "  cleanup - Limpar arquivos antigos"
            echo "  stats   - Mostrar estatísticas"
            echo "  all     - Executar todas as operações"
            exit 1
            ;;
    esac
    
    log "Operação concluída! 🎉"
}

# Executar
main "$@"
