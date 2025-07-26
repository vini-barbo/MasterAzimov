# Makefile para o projeto IGEM Stock Management System
# Comandos para gerenciar containers, banco de dados e aplicação

.PHONY: help up down restart logs build clean install migrate seed dev prod backup restore test health status shell docker-up docker-down docker-monitor docker-clean docker-status

# Cores para output
GREEN=\033[0;32m
YELLOW=\033[1;33m
RED=\033[0;31m
NC=\033[0m # No Color

# Variáveis
COMPOSE_FILE=compose.yaml
COMPOSE_FILE_PROD=compose.prod.yaml
BACKEND_CONTAINER=igem-stock-backend-dev
DB_CONTAINER=igem-stock-db-dev
REDIS_CONTAINER=igem-stock-redis-dev
DOCKER_MANAGER=./docker-manager.sh

# Comando padrão
help: ## Mostra esta ajuda
	@echo ""
	@echo "$(GREEN)IGEM Stock Management System - Comandos Make$(NC)"
	@echo ""
	@echo "$(YELLOW)Comandos de Container:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

## =================================================================
## COMANDOS DE CONTAINER - NOVA GESTÃO
## =================================================================

docker-up: ## Inicia aplicação usando o gerenciador Docker
	@echo "$(GREEN)Iniciando aplicação com gerenciador Docker...$(NC)"
	$(DOCKER_MANAGER) up

docker-down: ## Para aplicação usando o gerenciador Docker
	@echo "$(YELLOW)Parando aplicação com gerenciador Docker...$(NC)"
	$(DOCKER_MANAGER) down

docker-monitor: ## Inicia sistema de monitoramento usando o gerenciador Docker
	@echo "$(GREEN)Iniciando sistema de monitoramento...$(NC)"
	$(DOCKER_MANAGER) monitor-up

docker-clean: ## Limpa completamente todos os containers usando o gerenciador Docker
	@echo "$(RED)Limpeza completa dos containers...$(NC)"
	$(DOCKER_MANAGER) clean-all

docker-status: ## Mostra status dos containers usando o gerenciador Docker
	@echo "$(GREEN)Status dos containers:$(NC)"
	$(DOCKER_MANAGER) status

docker-restart: ## Reinicia aplicação usando o gerenciador Docker
	@echo "$(YELLOW)Reiniciando aplicação...$(NC)"
	$(DOCKER_MANAGER) restart

## =================================================================
## COMANDOS DE CONTAINER - MODO LEGADO
## =================================================================

up: ## Inicia todos os containers em modo desenvolvimento
	@echo "$(GREEN)Iniciando containers...$(NC)"
	docker compose -f $(COMPOSE_FILE) up -d
	@echo "$(GREEN)Aguardando containers ficarem prontos...$(NC)"
	@sleep 10
	@$(MAKE) health

up-backend: ## Inicia apenas backend, database e redis
	@echo "$(GREEN)Iniciando containers essenciais...$(NC)"
	docker compose -f $(COMPOSE_FILE) up -d database redis backend

up-infra: ## Inicia apenas infrastructure (database e redis)
	@echo "$(GREEN)Iniciando infrastructure...$(NC)"
	docker compose -f $(COMPOSE_FILE) up -d database redis

up-ui: ## Inicia apenas interfaces de visualização
	@echo "$(GREEN)Iniciando interfaces de visualização...$(NC)"
	docker compose -f $(COMPOSE_FILE) up -d pgadmin redisinsight adminer

up-full: ## Inicia todos os serviços incluindo interfaces
	@echo "$(GREEN)Iniciando todos os serviços...$(NC)"
	docker compose -f $(COMPOSE_FILE) up -d
	@echo "$(GREEN)Aguardando containers ficarem prontos...$(NC)"
	@sleep 15
	@$(MAKE) health

up-web: ## Inicia serviços e abre todas interfaces no navegador
	@echo "$(GREEN)Iniciando todos os serviços...$(NC)"
	docker compose -f $(COMPOSE_FILE) up -d
	@echo "$(GREEN)Aguardando containers ficarem prontos...$(NC)"
	@sleep 20
	@echo "$(GREEN)Abrindo interfaces no navegador...$(NC)"
	@command -v xdg-open > /dev/null && xdg-open http://localhost:3000/api/docs || echo "API Docs: http://localhost:3000/api/docs"
	@command -v xdg-open > /dev/null && xdg-open http://localhost:5050 || echo "pgAdmin: http://localhost:5050"
	@command -v xdg-open > /dev/null && xdg-open http://localhost:8001 || echo "RedisInsight: http://localhost:8001"
	@echo "$(GREEN)Todos os serviços iniciados e interfaces abertas!$(NC)"
	@$(MAKE) health

down: ## Para todos os containers
	@echo "$(YELLOW)Parando containers...$(NC)"
	docker compose -f $(COMPOSE_FILE) down

down-volumes: ## Para containers e remove volumes
	@echo "$(RED)Parando containers e removendo volumes...$(NC)"
	docker compose -f $(COMPOSE_FILE) down -v

restart: ## Reinicia todos os containers
	@echo "$(YELLOW)Reiniciando containers...$(NC)"
	@$(MAKE) down
	@$(MAKE) up

restart-backend: ## Reinicia apenas o backend
	@echo "$(YELLOW)Reiniciando backend...$(NC)"
	docker compose -f $(COMPOSE_FILE) restart backend

## =================================================================
## COMANDOS DE BUILD E DEPLOY
## =================================================================

build: ## Reconstroi todas as imagens
	@echo "$(GREEN)Reconstruindo imagens...$(NC)"
	docker compose -f $(COMPOSE_FILE) build --no-cache

build-backend: ## Reconstroi apenas a imagem do backend
	@echo "$(GREEN)Reconstruindo imagem do backend...$(NC)"
	docker compose -f $(COMPOSE_FILE) build --no-cache backend

prod-up: ## Inicia em modo produção
	@echo "$(GREEN)Iniciando em modo produção...$(NC)"
	docker compose -f $(COMPOSE_FILE_PROD) up -d

prod-build: ## Build para produção
	@echo "$(GREEN)Build para produção...$(NC)"
	docker compose -f $(COMPOSE_FILE_PROD) build --no-cache

## =================================================================
## COMANDOS DE BANCO DE DADOS
## =================================================================

migrate: ## Executa migrações do Prisma
	@echo "$(GREEN)Executando migrações...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec backend npx prisma migrate deploy

migrate-dev: ## Executa migrações em modo dev (com geração)
	@echo "$(GREEN)Executando migrações em modo dev...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec backend npx prisma migrate dev

migrate-reset: ## Reseta o banco e aplica migrações
	@echo "$(RED)Resetando banco de dados...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec backend npx prisma migrate reset --force

generate: ## Gera o cliente Prisma
	@echo "$(GREEN)Gerando cliente Prisma...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec backend npx prisma generate

seed: ## Popula o banco com dados de exemplo
	@echo "$(GREEN)Populando banco com dados de exemplo...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec backend npx prisma db seed

seed-reset: ## Reseta e popula o banco
	@echo "$(YELLOW)Resetando e populando banco...$(NC)"
	@$(MAKE) migrate-reset
	@$(MAKE) seed

## =================================================================
## COMANDOS DE DESENVOLVIMENTO
## =================================================================

install: ## Instala dependências no container
	@echo "$(GREEN)Instalando dependências...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec backend npm install

dev: ## Inicia modo desenvolvimento com watch
	@echo "$(GREEN)Iniciando modo desenvolvimento...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec backend npm run start:dev

dev-detached: ## Inicia modo desenvolvimento em background
	@echo "$(GREEN)Iniciando modo desenvolvimento em background...$(NC)"
	docker compose -f $(COMPOSE_FILE) up -d backend

studio: ## Abre Prisma Studio
	@echo "$(GREEN)Abrindo Prisma Studio...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec backend npx prisma studio

pgadmin: ## Abre pgAdmin (interface web para PostgreSQL)
	@echo "$(GREEN)Abrindo pgAdmin...$(NC)"
	@echo "Acesse: http://localhost:5050"
	@echo "Email: admin@igemstock.com"
	@echo "Senha: admin123"
	@command -v xdg-open > /dev/null && xdg-open http://localhost:5050 || echo "Abra manualmente: http://localhost:5050"

redisinsight: ## Abre RedisInsight (interface web para Redis)
	@echo "$(GREEN)Abrindo RedisInsight...$(NC)"
	@echo "Acesse: http://localhost:8001"
	@command -v xdg-open > /dev/null && xdg-open http://localhost:8001 || echo "Abra manualmente: http://localhost:8001"

adminer: ## Abre Adminer (interface web alternativa para banco)
	@echo "$(GREEN)Abrindo Adminer...$(NC)"
	@echo "Acesse: http://localhost:8081"
	@echo "Servidor: database"
	@echo "Usuário: postgres"
	@echo "Senha: postgres123"
	@echo "Banco: igem_stock_dev"
	@command -v xdg-open > /dev/null && xdg-open http://localhost:8081 || echo "Abra manualmente: http://localhost:8081"

## =================================================================
## COMANDOS DE TESTE E QUALIDADE
## =================================================================

test: ## Executa todos os testes
	@echo "$(GREEN)Executando testes...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec backend npm run test

test-watch: ## Executa testes em modo watch
	@echo "$(GREEN)Executando testes em modo watch...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec backend npm run test:watch

test-coverage: ## Executa testes com coverage
	@echo "$(GREEN)Executando testes com coverage...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec backend npm run test:cov

test-e2e: ## Executa testes end-to-end
	@echo "$(GREEN)Executando testes e2e...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec backend npm run test:e2e

test-watch: ## Executa testes em modo watch
	@echo "$(GREEN)Executando testes em modo watch...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec backend npm run test:watch

lint: ## Executa linter
	@echo "$(GREEN)Executando linter...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec backend npm run lint

format: ## Formata o código
	@echo "$(GREEN)Formatando código...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec backend npm run format

## =================================================================
## COMANDOS DE MONITORAMENTO E DEBUG
## =================================================================

logs: ## Mostra logs de todos os containers
	docker compose -f $(COMPOSE_FILE) logs -f

logs-backend: ## Mostra logs do backend
	docker compose -f $(COMPOSE_FILE) logs -f backend

logs-db: ## Mostra logs do banco
	docker compose -f $(COMPOSE_FILE) logs -f database

logs-redis: ## Mostra logs do redis
	docker compose -f $(COMPOSE_FILE) logs -f redis

health: ## Verifica status de todos os containers
	@echo "$(GREEN)Status dos containers:$(NC)"
	@docker compose -f $(COMPOSE_FILE) ps
	@echo ""
	@echo "$(GREEN)Health checks dos serviços principais:$(NC)"
	@docker compose -f $(COMPOSE_FILE) exec -T database pg_isready -U postgres -d igem_stock_dev || echo "$(RED)Database não está pronto$(NC)"
	@docker compose -f $(COMPOSE_FILE) exec -T redis redis-cli ping || echo "$(RED)Redis não está pronto$(NC)"
	@curl -s -f http://localhost:3000/health > /dev/null && echo "$(GREEN)Backend está pronto$(NC)" || echo "$(RED)Backend não está pronto$(NC)"
	@echo ""
	@echo "$(GREEN)Health checks das interfaces de visualização:$(NC)"
	@curl -s -f http://localhost:5050/login > /dev/null && echo "$(GREEN)pgAdmin está pronto$(NC)" || echo "$(YELLOW)pgAdmin não está rodando ou não está pronto$(NC)"
	@curl -s -f http://localhost:8001 > /dev/null && echo "$(GREEN)RedisInsight está pronto$(NC)" || echo "$(YELLOW)RedisInsight não está rodando$(NC)"
	@curl -s -f http://localhost:8081 > /dev/null && echo "$(GREEN)Adminer está pronto$(NC)" || echo "$(YELLOW)Adminer não está rodando$(NC)"

status: ## Status detalhado dos serviços
	@echo "$(GREEN)Status detalhado:$(NC)"
	docker compose -f $(COMPOSE_FILE) ps
	@echo ""
	@echo "$(GREEN)Uso de recursos:$(NC)"
	docker stats --no-stream $(BACKEND_CONTAINER) $(DB_CONTAINER) $(REDIS_CONTAINER) 2>/dev/null || echo "Containers não estão rodando"

## =================================================================
## COMANDOS DE SHELL E DEBUG
## =================================================================

shell: ## Acesso shell no container backend
	@echo "$(GREEN)Acessando shell do backend...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec backend bash

shell-db: ## Acesso shell no container database
	@echo "$(GREEN)Acessando shell do database...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec database bash

psql: ## Acesso direto ao PostgreSQL
	@echo "$(GREEN)Acessando PostgreSQL...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec database psql -U postgres -d igem_stock_dev

redis-cli: ## Acesso direto ao Redis CLI
	@echo "$(GREEN)Acessando Redis CLI...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec redis redis-cli

## =================================================================
## COMANDOS DE BACKUP E RESTORE
## =================================================================

backup: ## Faz backup do banco de dados
	@echo "$(GREEN)Fazendo backup do banco...$(NC)"
	@mkdir -p ./backups
	docker compose -f $(COMPOSE_FILE) exec database pg_dump -U postgres igem_stock_dev > ./backups/backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)Backup salvo em ./backups/$(NC)"

restore: ## Restaura backup do banco (usage: make restore BACKUP_FILE=backup_file.sql)
	@echo "$(YELLOW)Restaurando backup $(BACKUP_FILE)...$(NC)"
	@if [ -z "$(BACKUP_FILE)" ]; then echo "$(RED)Uso: make restore BACKUP_FILE=backup_file.sql$(NC)"; exit 1; fi
	docker compose -f $(COMPOSE_FILE) exec -T database psql -U postgres igem_stock_dev < $(BACKUP_FILE)

## =================================================================
## COMANDOS DE LIMPEZA
## =================================================================

clean: ## Remove containers, networks, volumes e imagens
	@echo "$(RED)Limpando ambiente...$(NC)"
	docker compose -f $(COMPOSE_FILE) down -v --rmi all --remove-orphans

clean-cache: ## Limpa cache do Docker
	@echo "$(YELLOW)Limpando cache do Docker...$(NC)"
	docker system prune -a

clean-volumes: ## Remove apenas volumes
	@echo "$(RED)Removendo volumes...$(NC)"
	docker compose -f $(COMPOSE_FILE) down -v

## =================================================================
## COMANDOS DE API E DOCUMENTAÇÃO
## =================================================================

api-docs: ## Abre documentação da API (Swagger)
	@echo "$(GREEN)Abrindo documentação da API...$(NC)"
	@echo "Acesse: http://localhost:3000/api/docs"
	@command -v xdg-open > /dev/null && xdg-open http://localhost:3000/api/docs || echo "Abra manualmente: http://localhost:3000/api/docs"

curl-test: ## Testa endpoints básicos da API
	@echo "$(GREEN)Testando endpoints da API...$(NC)"
	@echo "Health check:"
	@curl -s http://localhost:3000/health | jq . || echo "jq não instalado"
	@echo ""
	@echo "Products:"
	@curl -s http://localhost:3000/api/products | jq . || echo "jq não instalado"

## =================================================================
## COMANDOS COMBINADOS - ATUALIZADOS
## =================================================================

fresh-start: ## Para tudo, limpa, reconstroi e inicia usando novo gerenciador
	@echo "$(YELLOW)Reinicialização completa com novo gerenciador...$(NC)"
	@$(MAKE) docker-clean
	@$(MAKE) build
	@$(MAKE) docker-up
	@sleep 10
	@$(MAKE) migrate-dev
	@$(MAKE) seed

quick-start: ## Início rápido para desenvolvimento usando novo gerenciador
	@echo "$(GREEN)Início rápido com novo gerenciador...$(NC)"
	@$(MAKE) docker-up
	@sleep 10
	@$(MAKE) migrate-dev
	@$(MAKE) seed

## =================================================================
## COMANDOS COMBINADOS - MODO LEGADO
## =================================================================

legacy-fresh-start: ## Para tudo, limpa, reconstroi e inicia (modo legado)
	@echo "$(YELLOW)Reinicialização completa (modo legado)...$(NC)"
	@$(MAKE) down
	@$(MAKE) clean-volumes
	@$(MAKE) build
	@$(MAKE) up
	@$(MAKE) migrate-dev
	@$(MAKE) seed

legacy-quick-start: ## Início rápido para desenvolvimento (modo legado)
	@echo "$(GREEN)Início rápido (modo legado)...$(NC)"
	@$(MAKE) up-infra
	@sleep 5
	@$(MAKE) migrate-dev
	@$(MAKE) seed
	@$(MAKE) up-backend

## =================================================================
## INFORMAÇÕES
## =================================================================

info: ## Mostra informações do projeto
	@echo ""
	@echo "$(GREEN)=== IGEM Stock Management System ===$(NC)"
	@echo ""
	@echo "$(YELLOW)URLs da Aplicação:$(NC)"
	@echo "  API:           http://localhost:3000/api"
	@echo "  Documentação:  http://localhost:3000/api/docs"
	@echo "  Health Check:  http://localhost:3000/health"
	@echo ""
	@echo "$(YELLOW)Interfaces de Visualização:$(NC)"
	@echo "  pgAdmin:       http://localhost:5050 (admin@igemstock.com / admin123)"
	@echo "  RedisInsight:  http://localhost:8001"
	@echo "  Adminer:       http://localhost:8081 (database / postgres / postgres123)"
	@echo ""
	@echo "$(YELLOW)Banco de Dados:$(NC)"
	@echo "  Host:     localhost:5432"
	@echo "  Database: igem_stock_dev"
	@echo "  User:     postgres"
	@echo "  Password: postgres123"
	@echo ""
	@echo "$(YELLOW)Redis:$(NC)"
	@echo "  Host: localhost:6379"
	@echo ""
	@echo "$(YELLOW)Comandos úteis (NOVOS - RECOMENDADOS):$(NC)"
	@echo "  make docker-up       # Início da aplicação (novo método)"
	@echo "  make docker-down     # Parar aplicação (novo método)"
	@echo "  make docker-clean    # Limpeza completa (novo método)"
	@echo "  make docker-status   # Status dos containers (novo método)"
	@echo "  make quick-start     # Início rápido (novo método)"
	@echo ""
	@echo "$(YELLOW)Comandos úteis (LEGADO):$(NC)"
	@echo "  make up              # Início da aplicação (método legado)"
	@echo "  make down            # Parar aplicação (método legado)"
	@echo "  make legacy-quick-start # Início rápido (método legado)"
	@echo ""
	@echo "$(YELLOW)Comandos de desenvolvimento:$(NC)"
	@echo "  make docker-up       # Início da aplicação (novo método)"
	@echo "  make docker-down     # Parar aplicação (novo método)"
	@echo "  make docker-clean    # Limpeza completa (novo método)"
	@echo "  make docker-status   # Status dos containers (novo método)"
	@echo "  make quick-start     # Início rápido (novo método)"
	@echo ""
	@echo "$(YELLOW)Comandos úteis (LEGADO):$(NC)"
	@echo "  make up              # Início da aplicação (método legado)"
	@echo "  make down            # Parar aplicação (método legado)"
	@echo "  make legacy-quick-start # Início rápido (método legado)"
	@echo ""
	@echo "$(YELLOW)Comandos de desenvolvimento:$(NC)"
	@echo "  make dev          # Modo desenvolvimento"
	@echo "  make logs-backend # Ver logs"
	@echo "  make shell        # Shell do backend"
	@echo "  make pgadmin      # Interface do PostgreSQL"
	@echo "  make redisinsight # Interface do Redis"
	@echo "  make adminer      # Interface alternativa do banco"
	@echo "  make api-docs     # Ver documentação da API"
	@echo "  make test         # Executar testes"
	@echo "  make test-watch   # Testes em modo watch"
	@echo "  make test-coverage # Testes com coverage"
	@echo ""

# Comando padrão quando executar apenas 'make'
.DEFAULT_GOAL := help
