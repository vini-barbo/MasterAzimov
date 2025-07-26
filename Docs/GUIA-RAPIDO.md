# Guia de Referência Rápida - Master Azimov

## 🚀 Comandos Essenciais

### Gerenciamento de Ambientes
```bash
# Script de gerenciamento principal
./manage.sh dev         # Iniciar desenvolvimento (básico)
./manage.sh dev-full    # Desenvolvimento completo (com ELK)
./manage.sh prod        # Iniciar produção
./manage.sh stop-dev    # Parar desenvolvimento
./manage.sh stop-prod   # Parar produção
./manage.sh status      # Status de todos os serviços
./manage.sh health      # Health check
```

### Docker Compose
```bash
# Desenvolvimento
docker-compose -f compose.yaml up -d
docker-compose -f compose.yaml down

# Produção
docker-compose -f compose.prod.yaml up -d
docker-compose -f compose.prod.yaml down

# Logs específicos
docker-compose logs -f backend
docker-compose logs -f grafana
```

### Monitoramento
```bash
# Health check completo
./Monitor/scripts/health-check.sh

# Backup dos dados
./Monitor/scripts/backup-logs.sh backup

# Setup do monitoramento
cd Monitor && ./scripts/setup.sh
```

### Banco de Dados
```bash
# Conectar ao PostgreSQL
docker exec -it [container-name] psql -U [username] -d [database]

# Backup
pg_dump -h localhost -U [username] [database] > backup.sql
```

### Redis
```bash
# Conectar ao Redis
docker exec -it [redis-container] redis-cli

# Ver todas as chaves
KEYS *

# Limpar cache
FLUSHALL
```

## 📂 Estrutura de Diretórios

```
Master Azimov/
├── Docs/                     # 📚 Documentação centralizada
│   ├── README.md            # 📄 Índice principal
│   ├── INDICE-GERAL.md      # 📋 Busca por tópico
│   ├── GUIA-RAPIDO.md       # ⚡ Este arquivo
│   ├── BE-IGEMSTOCK/        # 🔧 Docs do Backend
│   ├── CA/                  # 💾 Docs do Cache
│   └── DB/                  # 🗄️ Docs do Database
├── BE-IGEMSTOCK/            # Backend NestJS
├── CA/                      # Redis Cache
├── DB/                      # PostgreSQL
├── FE/                      # Frontend
├── Monitor/                 # Monitoramento
└── nginx/                   # Proxy reverso
```

## 🔗 Links Úteis

| Recurso | Localização | Uso |
|---------|-------------|-----|
| **Setup Inicial** | [`Docs/DOCKER-README.md`](./DOCKER-README.md) | Primeiro setup do projeto |
| **API Backend** | [`Docs/BE-IGEMSTOCK/README.md`](./BE-IGEMSTOCK/README.md) | Desenvolvimento de APIs |
| **Configurar DB** | [`Docs/DB/README.md`](./DB/README.md) | Setup do PostgreSQL |
| **Cache Redis** | [`Docs/CA/README.md`](./CA/README.md) | Configuração de cache |
| **Status Projeto** | [`Docs/BE-IGEMSTOCK/IMPLEMENTACAO-CONCLUIDA.md`](./BE-IGEMSTOCK/IMPLEMENTACAO-CONCLUIDA.md) | Ver progresso |

## 🆘 Troubleshooting Rápido

### Problema: Container não inicia
```bash
# Verificar logs
docker-compose logs [service-name]

# Recrear container
docker-compose down [service-name]
docker-compose up -d [service-name]
```

### Problema: Banco não conecta
1. Verificar se o container está rodando: `docker ps`
2. Verificar configurações em: [`Docs/BE-IGEMSTOCK/DATABASE-REDIS-CONNECTION.md`](./BE-IGEMSTOCK/DATABASE-REDIS-CONNECTION.md)
3. Testar conexão: `docker exec -it [db-container] pg_isready`

### Problema: Cache não funciona
1. Verificar Redis: `docker exec -it [redis-container] redis-cli ping`
2. Ver integração: [`Docs/CA/INTEGRATION.md`](./CA/INTEGRATION.md)
3. Limpar cache: `docker exec -it [redis-container] redis-cli FLUSHALL`

## 📊 Health Checks

```bash
# Verificar todos os serviços
docker-compose ps

# Health check do backend
curl http://localhost:3000/api/health

# Status do banco
docker exec [db-container] pg_isready

# Status do Redis  
docker exec [redis-container] redis-cli ping
```

## 🔧 Configurações Importantes

### Variáveis de Ambiente
- Backend: `BE-IGEMSTOCK/.env`
- Database: `DB/.env`
- Redis: `CA/.env`

### Portas Padrão
- Backend: `3000`
- Database: `5432`
- Redis: `6379`
- Nginx: `80/443`
- **Grafana: `3030`**
- **Prometheus: `9090`**
- **Kibana: `5601`**
- **Elasticsearch: `9200`**
- **AlertManager: `9093`**
- **Jaeger: `16686`**

---

*Para informações detalhadas, consulte os documentos específicos em cada pasta.*
