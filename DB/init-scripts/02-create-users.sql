-- Criar usuários e permissões
-- 02-create-users.sql

-- Conectar ao banco da aplicação
\c igem_stock;

-- Criar usuário para a aplicação (se as variáveis de ambiente não criarem automaticamente)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'igem_app') THEN
        CREATE USER igem_app WITH PASSWORD 'app_password_change_me';
    END IF;
END
$$;

-- Criar usuário apenas para leitura
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'igem_readonly') THEN
        CREATE USER igem_readonly WITH PASSWORD 'readonly_password_change_me';
    END IF;
END
$$;

-- Conceder permissões ao usuário da aplicação
GRANT CONNECT ON DATABASE igem_stock TO igem_app;
GRANT USAGE ON SCHEMA public TO igem_app;
GRANT CREATE ON SCHEMA public TO igem_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO igem_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO igem_app;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO igem_app;

-- Permissões para futuras tabelas
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO igem_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO igem_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO igem_app;

-- Conceder permissões de leitura ao usuário readonly
GRANT CONNECT ON DATABASE igem_stock TO igem_readonly;
GRANT USAGE ON SCHEMA public TO igem_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO igem_readonly;

-- Permissões para futuras tabelas (readonly)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO igem_readonly;
