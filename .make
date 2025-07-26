# Configurações e funções auxiliares para o Makefile
# Este arquivo é incluído automaticamente pelo Makefile principal

# Configurações de ambiente
export COMPOSE_PROJECT_NAME=igem-stock
export NODE_ENV=development

# Funções auxiliares
define wait_for_service
	@echo "Aguardando $(1) ficar disponível..."
	@timeout=60; \
	while [ $$timeout -gt 0 ]; do \
		if $(2); then \
			echo "$(1) está disponível!"; \
			break; \
		fi; \
		sleep 1; \
		timeout=$$((timeout-1)); \
	done; \
	if [ $$timeout -eq 0 ]; then \
		echo "Timeout aguardando $(1)"; \
		exit 1; \
	fi
endef

# Função para verificar se um container está rodando
define check_container
	@docker compose -f $(COMPOSE_FILE) ps | grep -q $(1) && echo "✓ $(1) está rodando" || echo "✗ $(1) não está rodando"
endef

# Função para aguardar múltiplos serviços
define wait_for_all_services
	$(call wait_for_service,Database,docker compose -f $(COMPOSE_FILE) exec -T database pg_isready -U postgres -d igem_stock_dev > /dev/null 2>&1)
	$(call wait_for_service,Redis,docker compose -f $(COMPOSE_FILE) exec -T redis redis-cli ping > /dev/null 2>&1)
	$(call wait_for_service,Backend,curl -s -f http://localhost:3000/health > /dev/null 2>&1)
endef

# Aliases úteis
.PHONY: db migrate-up migrate-down

# Aliases para comandos comuns
db: psql
migrate-up: migrate-dev
migrate-down: migrate-reset
