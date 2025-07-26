#!/bin/bash

# Script para configurar o ambiente de desenvolvimento do backend

set -e

echo "🚀 Configurando ambiente de desenvolvimento do IGEM Stock Backend..."

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Execute este script no diretório BE-IGEMSTOCK"
    exit 1
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Gerar o cliente Prisma
echo "🗄️ Gerando cliente Prisma..."
npm run db:generate

# Verificar se os serviços estão rodando
echo "🔍 Verificando serviços..."

# Aguardar banco e Redis estarem disponíveis
echo "⏳ Aguardando banco de dados..."
until nc -z database 5432 2>/dev/null || nc -z localhost 5432 2>/dev/null; do
    echo "Banco ainda não está disponível, aguardando..."
    sleep 2
done

echo "⏳ Aguardando Redis..."
until nc -z redis 6379 2>/dev/null || nc -z localhost 6379 2>/dev/null; do
    echo "Redis ainda não está disponível, aguardando..."
    sleep 2
done

# Aplicar migrações
echo "🔄 Aplicando migrações do banco..."
npm run db:push

# Executar seed (opcional)
echo "🌱 Populando banco com dados iniciais..."
npm run db:seed || echo "⚠️ Seed falhou ou já foi executado"

echo "✅ Configuração concluída!"
echo ""
echo "🎯 Para iniciar o desenvolvimento:"
echo "   npm run start:dev"
echo ""
echo "🔧 Comandos úteis:"
echo "   npm run db:studio    # Interface visual do banco"
echo "   npm run db:reset     # Reset completo do banco"
echo "   npm run db:migrate   # Criar nova migração"
