# 🔍 Interfaces de Visualização - IGEMSTOCK

Este documento descreve as interfaces web disponíveis para visualização e gerenciamento dos dados do sistema IGEMSTOCK.

## 📊 Serviços Disponíveis

### 1. 🗄️ pgAdmin (PostgreSQL)
**URL:** http://localhost:5050  
**Propósito:** Interface web completa para gerenciamento do PostgreSQL

**Credenciais:**
- Email: `admin@igemstock.com`
- Senha: `admin123`

**Funcionalidades:**
- ✅ Visualização de todas as tabelas e dados
- ✅ Execução de queries SQL
- ✅ Gerenciamento de schemas e índices
- ✅ Backup e restore de dados
- ✅ Monitoramento de performance
- ✅ Edição de dados via interface gráfica

**Servidores Pré-configurados:**
- **IGEM Stock Development** (postgres/postgres123)
- **IGEM Stock (App User)** (igem_app)
- **IGEM Stock (ReadOnly)** (igem_readonly)

---

### 2. 🔴 RedisInsight (Redis)
**URL:** http://localhost:8001  
**Propósito:** Interface web para visualização e gerenciamento do Redis

**Configuração Automática:**
- Host: `redis` (container)
- Porta: `6379`
- Sem senha (ambiente de desenvolvimento)

**Funcionalidades:**
- ✅ Visualização de chaves e valores
- ✅ Monitoramento de performance
- ✅ Análise de uso de memória
- ✅ Execução de comandos Redis
- ✅ Profiler de operações
- ✅ Configuração de TTL

---

### 3. 🌐 Adminer (Alternativa Leve)
**URL:** http://localhost:8080  
**Propósito:** Interface web leve para banco de dados

**Credenciais:**
- Servidor: `database`
- Usuário: `postgres`
- Senha: `postgres123`
- Banco: `igem_stock_dev`

**Funcionalidades:**
- ✅ Interface mais simples que pgAdmin
- ✅ Execução rápida de queries
- ✅ Visualização de estrutura de tabelas
- ✅ Exportação de dados
- ✅ Edição inline de registros

---

## 🚀 Como Usar

### Iniciando os Serviços

```bash
# Iniciar apenas as interfaces
make up-ui

# Iniciar tudo (aplicação + interfaces)
make up-full

# Abrir interfaces específicas
make pgadmin      # Abre pgAdmin
make redisinsight # Abre RedisInsight  
make adminer      # Abre Adminer
```

### Acessos Diretos

```bash
# URLs diretas
open http://localhost:5050  # pgAdmin
open http://localhost:8001  # RedisInsight
open http://localhost:8080  # Adminer

# Ou usar comandos do Makefile
make info  # Mostra todas as URLs
```

---

## 📋 Cenários de Uso

### 🔍 Exploração de Dados
**Use:** pgAdmin ou Adminer
- Visualizar estrutura das tabelas
- Conferir relacionamentos
- Validar dados de seed

### 🧪 Desenvolvimento e Debug
**Use:** pgAdmin
- Executar queries complexas
- Analisar planos de execução
- Verificar índices e performance

### ⚡ Cache e Sessões
**Use:** RedisInsight
- Monitorar chaves de cache
- Verificar TTL de sessões
- Analisar uso de memória

### 📊 Análise Rápida
**Use:** Adminer
- Queries simples e rápidas
- Edição pontual de dados
- Exportação de relatórios

---

## 🔧 Configurações Avançadas

### pgAdmin - Conexões Personalizadas

Se precisar conectar manualmente:

```
Host: database (dentro do Docker) ou localhost (externo)
Porta: 5432
Database: igem_stock_dev
Username: postgres
Password: postgres123
```

### RedisInsight - Configuração Manual

Se a conexão automática falhar:

```
Host: redis (dentro do Docker) ou localhost (externo)  
Porta: 6379
Database: 0
Authentication: Nenhuma
```

### Adminer - Sistemas Suportados

Além do PostgreSQL, o Adminer suporta:
- MySQL/MariaDB
- SQLite
- Oracle
- MS SQL

---

## 🛡️ Segurança (Desenvolvimento)

⚠️ **ATENÇÃO:** Estas configurações são apenas para desenvolvimento!

**Credenciais padrão:**
- Nunca use em produção
- Senhas simples apenas para dev
- Acesso sem SSL/TLS

**Para produção:**
- Altere todas as senhas
- Configure SSL/TLS
- Restrinja acesso por IP
- Use autenticação externa

---

## 📊 Monitoramento

### pgAdmin - Health Check
- Verifique se o container está rodando
- Teste conexão com o banco
- Monitore logs de erro

### RedisInsight - Métricas
- Uso de memória
- Operações por segundo
- Latência de comandos
- Número de conexões

---

## 🆘 Troubleshooting

### Container não inicia
```bash
# Verificar logs
docker compose logs pgadmin
docker compose logs redisinsight
docker compose logs adminer

# Verificar dependências
make health
```

### Não consegue conectar ao banco
```bash
# Verificar se o banco está rodando
make health

# Testar conexão direta
make psql

# Verificar networks
docker network ls
```

### Interface lenta
```bash
# Verificar recursos
docker stats

# Restart do serviço específico
docker compose restart pgadmin
```

---

## 📚 Links Úteis

- [Documentação pgAdmin](https://www.pgadmin.org/docs/)
- [Documentação RedisInsight](https://docs.redis.com/latest/ri/)
- [Documentação Adminer](https://www.adminer.org/en/)

---

**Criado por**: Sistema IGEMSTOCK  
**Data**: 26 de Julho de 2025  
**Versão**: 1.0.0
