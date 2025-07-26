# Docker Setup - IGEM Stock Backend

Este diretório contém a configuração Docker para o backend da aplicação IGEM Stock.

## Arquivos Docker

- `Dockerfile.dev` - Container para desenvolvimento com hot reload
- `Dockerfile.prod` - Container otimizado para produção
- `docker-compose.yml` - Orquestração para desenvolvimento
- `docker-compose.prod.yml` - Orquestração para produção
- `.dockerignore` - Arquivos ignorados no build

## Desenvolvimento

### Pré-requisitos
- Docker
- Docker Compose
- Node.js 18+ (opcional, para desenvolvimento local)

### Configuração Inicial

1. **Clonar e configurar variáveis de ambiente:**
```bash
cp .env.example .env
# Editar .env com suas configurações
```

2. **Iniciar ambiente de desenvolvimento:**
```bash
# Build e start de todos os serviços
docker-compose up --build

# Ou em background
docker-compose up -d --build
```

3. **Executar migrações do Prisma (se necessário):**
```bash
# Acessar container do backend
docker-compose exec backend-dev bash

# Executar migrações
npx prisma migrate dev
npx prisma db seed
```

### Serviços Disponíveis

- **Backend**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **pgAdmin**: http://localhost:5050 (admin@igem.com / admin)

### Comandos Úteis

```bash
# Ver logs
docker-compose logs -f backend-dev

# Parar serviços
docker-compose down

# Parar e remover volumes
docker-compose down -v

# Rebuild apenas o backend
docker-compose up --build backend-dev

# Executar comandos no container
docker-compose exec backend-dev npm run test
docker-compose exec backend-dev npx prisma studio
```

## Produção

### Build da imagem de produção:
```bash
docker build -f Dockerfile.prod -t igem-stock-backend:latest .
```

### Deploy com docker-compose:
```bash
# Configurar variáveis de ambiente para produção
cp .env.example .env.prod
# Editar .env.prod

# Deploy
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

### Variáveis de Ambiente Obrigatórias para Produção:
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `REDIS_PASSWORD`

## Hot Reload no Desenvolvimento

O Dockerfile de desenvolvimento está configurado para:
- Mapear o código fonte como volume (`./:/app`)
- Preservar `node_modules` em volume separado
- Usar `npm run start:dev` que tem hot reload automático
- Qualquer mudança nos arquivos será refletida automaticamente

## Estrutura dos Containers

### Desenvolvimento (`Dockerfile.dev`)
- Base: `node:18-alpine`
- Instala todas as dependências
- Mapeia código fonte como volume
- Executa em modo watch

### Produção (`Dockerfile.prod`)
- Multi-stage build para otimização
- Build stage: compila TypeScript
- Production stage: apenas runtime necessário
- Usuário não-root para segurança
- Health check configurado
- Otimizado para tamanho e performance

## Troubleshooting

### Container não inicia:
```bash
# Verificar logs
docker-compose logs backend-dev

# Verificar dependências
docker-compose exec backend-dev npm ls
```

### Hot reload não funciona:
- Verificar se o volume está mapeado corretamente
- Confirmar que `start:dev` usa `--watch`

### Problemas de permissão:
```bash
# Ajustar permissões do diretório
sudo chown -R $USER:$USER .
```

### Banco não conecta:
- Verificar se `DATABASE_URL` está correto
- Confirmar se PostgreSQL subiu corretamente: `docker-compose ps`
