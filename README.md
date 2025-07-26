# 🚀 Master Azimov - Sistema de Gestão de Estoque IGEM

Sistema completo de gestão de estoque desenvolvido com NestJS, PostgreSQL, Redis e stack completa de monitoramento.

## 📋 Visão Geral

O Master Azimov é uma aplicação moderna para gestão de estoque que inclui:

- **Backend API** - NestJS com TypeScript
- **Banco de Dados** - PostgreSQL com Prisma ORM
- **Cache** - Redis para performance
- **Monitoramento** - Prometheus, Grafana, ELK Stack
- **Alertas** - AlertManager com notificações
- **Tracing** - Jaeger para rastreamento distribuído

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │   React     │ │───▶│ │   NestJS    │ │───▶│ │ PostgreSQL  │ │
│ │   Next.js   │ │    │ │ TypeScript  │ │    │ │   Prisma    │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    │ ┌─────────────┐ │    │ ┌─────────────┐ │
                       │ │    Redis    │ │    │ │   Backup    │ │
┌─────────────────┐    │ │   Cache     │ │    │ │   Scripts   │ │
│  Monitoring     │    │ └─────────────┘ │    │ └─────────────┘ │
│                 │    └─────────────────┘    └─────────────────┘
│ ┌─────────────┐ │              │
│ │ Prometheus  │ │◀─────────────┘
│ │  Grafana    │ │
│ │   ELK       │ │    ┌─────────────────┐
│ │  Jaeger     │ │    │   Proxy/LB      │
│ └─────────────┘ │    │                 │
└─────────────────┘    │ ┌─────────────┐ │
                       │ │    Nginx    │ │
                       │ │     SSL     │ │
                       │ └─────────────┘ │
                       └─────────────────┘
```

## ⚡ Setup Rápido

### 1. Pré-requisitos
- Docker e Docker Compose
- Git
- Make (opcional)

### 2. Clonar e Configurar
```bash
git clone https://github.com/vini-barbo/MasterAzimov.git
cd MasterAzimov

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações
```

### 3. Iniciar Ambiente

#### Desenvolvimento Básico
```bash
./manage.sh dev
```

#### Desenvolvimento Completo (com logging)
```bash
./manage.sh dev-full
```

#### Produção
```bash
./manage.sh prod
```

## 🌐 Acessos

| Serviço | URL | Credenciais | Descrição |
|---------|-----|-------------|-----------|
| **Backend API** | http://localhost:3000 | - | API REST do sistema |
| **Grafana** | http://localhost:3030 | admin/admin123 | Dashboards e métricas |
| **Prometheus** | http://localhost:9090 | - | Coleta de métricas |
| **Kibana** | http://localhost:5601 | - | Análise de logs |
| **AlertManager** | http://localhost:9093 | - | Gestão de alertas |
| **Jaeger** | http://localhost:16686 | - | Tracing distribuído |

## 📊 Funcionalidades

### ✅ Implementado
- [x] Autenticação e autorização JWT
- [x] CRUD de usuários com roles
- [x] Gestão de estoque (itens, movimentações)
- [x] Auditoria completa de mudanças
- [x] Cache Redis para performance
- [x] Documentação OpenAPI/Swagger
- [x] Testes unitários e e2e
- [x] Docker multi-stage builds
- [x] Stack completa de monitoramento
- [x] Alertas automatizados
- [x] Logging estruturado
- [x] Health checks
- [x] Backup automatizado

### 🔄 Em Desenvolvimento
- [ ] Frontend React/Next.js
- [ ] Relatórios avançados
- [ ] Notificações push
- [ ] Integração com APIs externas
- [ ] Dashboard analytics

## 🛠️ Scripts de Gerenciamento

### Principais Comandos
```bash
# Gerenciamento de ambientes
./manage.sh dev         # Desenvolvimento básico
./manage.sh dev-full    # Desenvolvimento completo
./manage.sh prod        # Produção
./manage.sh status      # Status dos serviços
./manage.sh health      # Health check
./manage.sh backup      # Backup dos dados

# Logs específicos
./manage.sh logs-dev backend
./manage.sh logs-prod grafana

# Monitoramento dedicado
cd Monitor
./scripts/setup.sh            # Setup do monitoramento
./scripts/health-check.sh      # Health check detalhado
./scripts/backup-logs.sh all   # Backup completo
```

## 📁 Estrutura do Projeto

```
Master Azimov/
├── 📁 BE-IGEMSTOCK/          # Backend NestJS
│   ├── src/                  # Código fonte
│   ├── prisma/               # Schema e migrations
│   ├── test/                 # Testes
│   └── Dockerfile.*          # Imagens Docker
├── 📁 CA/                    # Redis Cache
│   ├── config/               # Configurações Redis
│   └── scripts/              # Scripts de manutenção
├── 📁 DB/                    # PostgreSQL Database
│   ├── init-scripts/         # Scripts de inicialização
│   └── scripts/              # Backup e manutenção
├── 📁 Monitor/               # Sistema de Monitoramento
│   ├── prometheus/           # Configurações Prometheus
│   ├── grafana/              # Dashboards Grafana
│   ├── logstash/             # Pipeline Logstash
│   ├── filebeat/             # Coleta de logs
│   └── scripts/              # Scripts de gerenciamento
├── 📁 Docs/                  # Documentação
│   ├── README.md             # Índice principal
│   ├── MONITORAMENTO.md      # Guia de monitoramento
│   └── ...                   # Documentação detalhada
├── 📁 nginx/                 # Proxy reverso
├── compose.yaml              # Docker Compose dev
├── compose.prod.yaml         # Docker Compose produção
├── manage.sh                 # Script principal de gerenciamento
└── .env.example              # Variáveis de ambiente
```

## 🔧 Desenvolvimento

### Tecnologias Utilizadas

**Backend:**
- NestJS (Framework Node.js)
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- JWT Authentication
- Swagger/OpenAPI

**Monitoramento:**
- Prometheus (Métricas)
- Grafana (Visualização)
- Elasticsearch (Logs)
- Logstash (Processamento)
- Kibana (Análise)
- Filebeat (Coleta)
- AlertManager (Alertas)
- Jaeger (Tracing)

**DevOps:**
- Docker & Docker Compose
- Multi-stage builds
- Health checks
- Logging estruturado
- Backup automatizado

### Configuração de Desenvolvimento

1. **Setup do Backend:**
```bash
cd BE-IGEMSTOCK
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```

2. **Setup do Banco:**
```bash
# Via Docker (recomendado)
docker-compose -f compose.yaml up -d database

# Ou local
createdb igem_stock_dev
```

3. **Setup do Monitoramento:**
```bash
cd Monitor
./scripts/setup.sh
```

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| [`Docs/README.md`](./Docs/README.md) | Índice da documentação |
| [`Docs/MONITORAMENTO.md`](./Docs/MONITORAMENTO.md) | Guia de monitoramento |
| [`Docs/GUIA-RAPIDO.md`](./Docs/GUIA-RAPIDO.md) | Referência rápida |
| [`BE-IGEMSTOCK/README.md`](./BE-IGEMSTOCK/README.md) | Backend detalhado |
| [`Monitor/README.md`](./Monitor/README.md) | Monitoramento técnico |

## 🔒 Segurança

### Produção
- Altere todas as senhas padrão no `.env`
- Configure HTTPS no Nginx
- Use secrets do Docker para senhas
- Configure firewall para portas específicas
- Mantenha backups seguros

### Variáveis Críticas
```bash
POSTGRES_PASSWORD=senha_super_segura
JWT_SECRET=chave_jwt_muito_segura_32_chars+
GRAFANA_ADMIN_PASSWORD=senha_grafana_segura
REDIS_PASSWORD=senha_redis_segura
```

## 📈 Monitoramento

### Dashboards Principais
- **System Overview** - Visão geral do sistema
- **Application Metrics** - Métricas da aplicação
- **Database Performance** - Performance do PostgreSQL
- **Cache Monitoring** - Métricas do Redis

### Alertas Configurados
- CPU/Memória alta
- Serviços offline
- Erros da aplicação
- Performance degradada

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.

## 👥 Autores

- **Vinícius Barbosa** - *Desenvolvimento inicial* - [@vini-barbo](https://github.com/vini-barbo)

## 🙏 Agradecimentos

- Equipe IGEM
- Comunidade NestJS
- Comunidade Open Source

---

**🚀 Master Azimov - Gestão de Estoque com Monitoramento Completo!**
