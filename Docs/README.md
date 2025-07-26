# Master Azimov - Documentação Centralizada

Este diretório contém toda a documentação do projeto Master Azimov, organizada por módulos e componentes.

## 📁 Estrutura da Documentação

### 🐳 Docker e Containerização
- [`DOCKER-README.md`](./DOCKER-README.md) - Documentação principal do Docker para o projeto

### 🔧 Backend (BE-IGEMSTOCK)
- [`BE-IGEMSTOCK/README.md`](./BE-IGEMSTOCK/README.md) - Documentação principal do backend
- [`BE-IGEMSTOCK/DOCKER.md`](./BE-IGEMSTOCK/DOCKER.md) - Configuração Docker do backend
- [`BE-IGEMSTOCK/DATABASE-REDIS-CONNECTION.md`](./BE-IGEMSTOCK/DATABASE-REDIS-CONNECTION.md) - Configuração de conexões com banco de dados e Redis
- [`BE-IGEMSTOCK/IMPLEMENTACAO-CONCLUIDA.md`](./BE-IGEMSTOCK/IMPLEMENTACAO-CONCLUIDA.md) - Status de implementação e funcionalidades concluídas

### 💾 Cache e Redis (CA)
- [`CA/README.md`](./CA/README.md) - Documentação do sistema de cache
- [`CA/INTEGRATION.md`](./CA/INTEGRATION.md) - Guia de integração do Redis

### 🗄️ Banco de Dados (DB)
- [`DB/README.md`](./DB/README.md) - Documentação do banco de dados PostgreSQL

## 🚀 Como Navegar

1. **Para configuração inicial**: Comece com o `DOCKER-README.md`
2. **Para desenvolvimento backend**: Veja `BE-IGEMSTOCK/README.md`
3. **Para configuração de banco**: Consulte `DB/README.md`
4. **Para cache/Redis**: Veja `CA/README.md` e `CA/INTEGRATION.md`

## 📝 Contribuindo com a Documentação

Para manter a documentação atualizada:

1. Sempre atualize a documentação junto com mudanças no código
2. Mantenha esta estrutura organizada por módulos
3. Use links relativos para facilitar a navegação
4. Inclua exemplos práticos sempre que possível

## 🏗️ Estrutura da Documentação

```
Docs/
├── BE-IGEMSTOCK/
│   ├── DATABASE-REDIS-CONNECTION.md    # Configuração de conexões DB/Redis
│   ├── DOCKER.md                       # Docker específico do backend
│   ├── IMPLEMENTACAO-CONCLUIDA.md      # Status de implementação
│   └── README.md                       # Documentação principal do backend
├── CA/
│   ├── INTEGRATION.md                  # Guia de integração Redis
│   └── README.md                       # Documentação do sistema de cache
├── DB/
│   └── README.md                       # Configuração PostgreSQL
├── DOCKER-README.md                    # Setup Docker principal
├── GUIA-RAPIDO.md                      # Referência rápida e comandos
├── INDICE-GERAL.md                     # Índice completo por tópicos
└── README.md                           # Este arquivo
```

## 🏗️ Arquitetura do Projeto

```
Master Azimov/
├── BE-IGEMSTOCK/     # Backend NestJS
├── CA/               # Cache Redis
├── DB/               # PostgreSQL Database
├── Docs/             # 📚 Documentação centralizada
├── FE/               # Frontend (a ser documentado)
├── Monitor/          # Monitoramento (a ser documentado)
└── nginx/            # Proxy reverso
```

---

*Última atualização: $(date +"%d/%m/%Y")*
