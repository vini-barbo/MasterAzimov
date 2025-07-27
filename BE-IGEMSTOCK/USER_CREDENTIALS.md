# 👥 Credenciais de Usuários Padrão

Este arquivo contém as credenciais dos usuários padrão criados no sistema IGEMSTOCK para facilitar o login durante desenvolvimento e testes.

## 🔐 Usuários Disponíveis

### 👑 Administradores (ADMIN)
- **Email:** `admin@igemstock.com`
  - **Username:** `admin`
  - **Password:** `admin123`
  - **Nome:** Admin User

- **Email:** `gerente@igemstock.com`
  - **Username:** `gerente`
  - **Password:** `ger123`
  - **Nome:** Roberto Gerente

### 🛡️ Moderadores (MODERATOR)
- **Email:** `moderator@igemstock.com`
  - **Username:** `moderator`
  - **Password:** `mod123`
  - **Nome:** João Moderador

- **Email:** `supervisor@igemstock.com`
  - **Username:** `supervisor`
  - **Password:** `super123`
  - **Nome:** Ana Supervisora

### 👤 Usuários Comuns (USER)
- **Email:** `user@igemstock.com`
  - **Username:** `user`
  - **Password:** `user123`
  - **Nome:** Maria Silva

- **Email:** `operador@igemstock.com`
  - **Username:** `operador`
  - **Password:** `op123`
  - **Nome:** Carlos Operador

## 🎯 Como Usar

1. Execute o seed do banco de dados para criar os usuários:
   ```bash
   npm run seed
   # ou
   npx prisma db seed
   ```

2. Use qualquer uma das credenciais acima para fazer login no sistema

3. Teste diferentes níveis de acesso com os diferentes roles:
   - **ADMIN**: Acesso completo ao sistema
   - **MODERATOR**: Acesso moderado com algumas restrições
   - **USER**: Acesso básico do usuário final

## ⚠️ Importante

- **NUNCA** use essas credenciais em produção
- Estas são apenas para desenvolvimento e testes
- Em produção, sempre use senhas seguras e únicas
- Considere desabilitar ou remover estes usuários antes do deploy

## 📝 Notas

- Todas as senhas são criptografadas com bcrypt no banco de dados
- Os usuários são criados como ativos (`isActive: true`)
- Cada usuário tem um ID único gerado automaticamente
