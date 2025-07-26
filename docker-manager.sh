#!/bin/bash

# Script para gerenciar Docker Compose do IGEMSTOCK
# Autor: Sistema IGEMSTOCK
# Data: 26/07/2025

set -e

COMPOSE_FILE="compose.yaml"
PROJECT_NAME="igemstock"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_help() {
    echo -e "${BLUE}🐳 IGEMSTOCK Docker Manager${NC}"
    echo ""
    echo "Uso: $0 [COMANDO]"
    echo ""
    echo "Comandos disponíveis:"
    echo -e "  ${GREEN}up${NC}           - Sobe apenas os serviços do compose.yaml"
    echo -e "  ${GREEN}down${NC}         - Para todos os serviços"
    echo -e "  ${GREEN}restart${NC}      - Reinicia os serviços"
    echo -e "  ${GREEN}logs${NC}         - Mostra logs dos serviços"
    echo -e "  ${GREEN}ps${NC}           - Lista containers rodando"
    echo -e "  ${GREEN}clean${NC}        - Para e remove TODOS os containers"
    echo -e "  ${GREEN}monitor-up${NC}   - Sobe apenas o sistema de monitoramento"
    echo -e "  ${GREEN}monitor-down${NC} - Para o sistema de monitoramento"
    echo -e "  ${GREEN}full-up${NC}      - Sobe aplicação + monitoramento"
    echo -e "  ${GREEN}full-down${NC}    - Para tudo"
    echo ""
}

# Função para subir apenas a aplicação principal
app_up() {
    echo -e "${GREEN}🚀 Subindo aplicação principal...${NC}"
    docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME up -d
    echo -e "${GREEN}✅ Aplicação principal rodando!${NC}"
}

# Função para parar aplicação principal
app_down() {
    echo -e "${YELLOW}🛑 Parando aplicação principal...${NC}"
    docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME down
    echo -e "${GREEN}✅ Aplicação principal parada!${NC}"
}

# Função para subir monitoramento
monitor_up() {
    echo -e "${GREEN}📊 Subindo sistema de monitoramento...${NC}"
    cd Monitor
    docker-compose -p ${PROJECT_NAME}-monitor up -d
    cd ..
    echo -e "${GREEN}✅ Monitoramento rodando!${NC}"
}

# Função para parar monitoramento
monitor_down() {
    echo -e "${YELLOW}🛑 Parando sistema de monitoramento...${NC}"
    cd Monitor
    docker-compose -p ${PROJECT_NAME}-monitor down
    cd ..
    echo -e "${GREEN}✅ Monitoramento parado!${NC}"
}

# Função para limpar tudo
clean_all() {
    echo -e "${RED}🧹 Limpando TODOS os containers...${NC}"
    
    # Para containers do projeto principal
    docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME down --remove-orphans || true
    
    # Para containers do monitoramento
    cd Monitor
    docker-compose -p ${PROJECT_NAME}-monitor down --remove-orphans || true
    cd ..
    
    # Para containers de outras pastas
    cd DB && docker-compose down || true && cd ..
    cd CA && docker-compose down || true && cd ..
    
    # Remove containers órfãos
    docker container prune -f
    
    echo -e "${GREEN}✅ Limpeza concluída!${NC}"
}

# Função para mostrar status
show_status() {
    echo -e "${BLUE}📋 Status dos containers:${NC}"
    echo ""
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

# Função para mostrar logs
show_logs() {
    echo -e "${BLUE}📄 Logs da aplicação principal:${NC}"
    docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME logs -f --tail=50
}

# Main switch
case "${1:-help}" in
    "up")
        app_up
        ;;
    "down")
        app_down
        ;;
    "restart")
        app_down
        sleep 2
        app_up
        ;;
    "logs")
        show_logs
        ;;
    "ps")
        show_status
        ;;
    "clean")
        clean_all
        ;;
    "monitor-up")
        monitor_up
        ;;
    "monitor-down")
        monitor_down
        ;;
    "full-up")
        app_up
        sleep 5
        monitor_up
        ;;
    "full-down")
        app_down
        monitor_down
        ;;
    "help"|*)
        print_help
        ;;
esac
