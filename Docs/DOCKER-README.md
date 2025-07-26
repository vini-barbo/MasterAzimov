# Docker Compose - IGEM Stock

Este projeto contém configurações Docker Compose para desenvolvimento e produção da aplicação IGEM Stock.

## Estrutura

- `compose.yaml` - Configuração para ambiente de desenvolvimento
- `compose.prod.yaml` - Configuração para ambiente de produção
- `.env.prod.example` - Exemplo de variáveis de ambiente para produção
- `nginx/nginx.conf` - Configuração do Nginx para produção

## Ambiente de Desenvolvimento

### Pré-requisitos
- Docker e Docker Compose instalados
- Portas 3000, 5432 e 6379 disponíveis

### Executar

```bash
# Subir todos os serviços
docker-compose up -d

# Ou subir com logs visíveis
docker-compose up

# Parar os serviços
docker-compose down

# Parar e remover volumes (cuidado: apaga dados do banco)
docker-compose down -v
```

### Serviços Disponíveis

- **Backend**: http://localhost:3000
- **Banco PostgreSQL**: localhost:5432
  - Database: `igem_stock_dev`
  - User: `postgres`
  - Password: `postgres123`
- **Redis**: localhost:6379 (configuração customizada da pasta CA)

### Recursos do Desenvolvimento

- Hot reload automático no backend
- Volumes montados para desenvolvimento ativo
- Banco de dados com scripts de inicialização
- Redis customizado com configurações avançadas, health checks e logs
- Scripts de manutenção e backup do Redis

## Ambiente de Produção

### Pré-requisitos
- Docker e Docker Compose instalados
- Arquivo `.env.prod` configurado

### Configuração

1. Copie o arquivo de exemplo:
```bash
cp .env.prod.example .env.prod
```

2. Edite `.env.prod` com suas configurações:
```bash
# Configure senhas fortes
POSTGRES_PASSWORD=sua_senha_forte_aqui
REDIS_PASSWORD=sua_senha_redis_aqui
JWT_SECRET=seu_jwt_secret_muito_forte_aqui

# Configure domínio e CORS
CORS_ORIGIN=https://seudominio.com

# Outras configurações conforme necessário
```

### Executar

```bash
# Subir em produção
docker-compose -f compose.prod.yaml --env-file .env.prod up -d

# Ver logs
docker-compose -f compose.prod.yaml logs -f

# Parar
docker-compose -f compose.prod.yaml down
```

### Serviços de Produção

- **Backend**: Porta configurada em `BACKEND_PORT` (padrão: 3000)
- **Banco PostgreSQL**: Porta configurada em `DB_PORT` (padrão: 5432)
- **Redis**: Porta configurada em `REDIS_PORT` (padrão: 6379) - configuração customizada otimizada para produção
- **Nginx** (opcional): Portas 80 e 443

### Características de Produção

- Imagens otimizadas multi-stage
- Health checks configurados
- Logs estruturados com rotação
- Limites de recursos
- Configurações de segurança
- Nginx como reverse proxy
- Usuários não-root nos containers
- Restart policies configuradas
- Redis customizado com configurações de produção, backup automático e monitoramento

## SSL/HTTPS (Opcional)

Para habilitar HTTPS em produção:

1. Coloque seus certificados em `nginx/ssl/`:
   - `cert.pem` - Certificado
   - `key.pem` - Chave privada

2. Descomente as linhas SSL no `nginx/nginx.conf`

3. Configure redirecionamento HTTP → HTTPS

## Backup e Manutenção

### Backup do Banco
```bash
# Desenvolvimento
docker-compose exec database pg_dump -U postgres igem_stock_dev > backup_dev.sql

# Produção
docker-compose -f compose.prod.yaml exec database pg_dump -U postgres igem_stock > backup_prod.sql
```

### Logs
```bash
# Ver logs de um serviço específico
docker-compose logs -f backend

# Ver logs com timestamp
docker-compose logs -t
```

### Monitoramento
```bash
# Status dos containers
docker-compose ps

# Uso de recursos
docker stats
```

## Troubleshooting

### Problemas Comuns

1. **Porta já em uso**: Verifique se as portas 3000, 5432, 6379 estão livres
2. **Permissões**: Certifique-se que o Docker tem permissões adequadas
3. **Memory**: Verifique se há memória suficiente disponível
4. **Volumes**: Em caso de problemas, remova volumes: `docker-compose down -v`

### Reset Completo
```bash
# Para desenvolvimento
docker-compose down -v --remove-orphans
docker-compose up -d

# Para produção
docker-compose -f compose.prod.yaml down -v --remove-orphans
docker-compose -f compose.prod.yaml --env-file .env.prod up -d
```

## Scripts Úteis

### Desenvolvimento
```bash
# Rebuild completo
docker-compose down && docker-compose build --no-cache && docker-compose up -d

# Logs em tempo real
docker-compose logs -f backend database redis
```

### Produção
```bash
# Deploy com rebuild
docker-compose -f compose.prod.yaml down && \
docker-compose -f compose.prod.yaml build --no-cache && \
docker-compose -f compose.prod.yaml --env-file .env.prod up -d

# Health check
docker-compose -f compose.prod.yaml exec backend curl -f http://localhost:3000/health
```
