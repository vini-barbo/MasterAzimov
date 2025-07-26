# Dockerfile para PostgreSQL customizado
FROM postgres:17-alpine

# Instalar extensões e ferramentas úteis
RUN apk add --no-cache \
    curl \
    postgresql-contrib \
    postgresql-dev

# Criar diretórios necessários
RUN mkdir -p /docker-entrypoint-initdb.d
RUN mkdir -p /var/lib/postgresql/backups

# Copiar scripts de inicialização
COPY ./init-scripts/ /docker-entrypoint-initdb.d/

# Copiar arquivo de configuração personalizado
COPY ./postgresql.conf /etc/postgresql/postgresql.conf
COPY ./pg_hba.conf /etc/postgresql/pg_hba.conf

# Definir permissões
RUN chown -R postgres:postgres /var/lib/postgresql/backups
RUN chmod 755 /docker-entrypoint-initdb.d/*.sql

# Expor porta padrão do PostgreSQL
EXPOSE 5432

# Definir volumes
VOLUME ["/var/lib/postgresql/data", "/var/lib/postgresql/backups"]

# Usar configurações personalizadas
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf", "-c", "hba_file=/etc/postgresql/pg_hba.conf"]
