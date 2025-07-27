import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function testCredentials() {
  console.log('🔍 Testando credenciais dos usuários...\n');

  const testCases = [
    { email: 'admin@igemstock.com', password: 'admin123' },
    { email: 'user@igemstock.com', password: 'user123' },
    { email: 'moderator@igemstock.com', password: 'mod123' },
  ];

  for (const testCase of testCases) {
    console.log(`Testando: ${testCase.email}`);

    try {
      // Buscar usuário no banco
      const user = await prisma.user.findUnique({
        where: { email: testCase.email },
      });

      if (!user) {
        console.log(`❌ Usuário não encontrado: ${testCase.email}`);
        continue;
      }

      console.log(`✅ Usuário encontrado: ${user.username} (${user.role})`);
      console.log(`   Ativo: ${user.isActive}`);
      console.log(`   Hash no banco: ${user.password.substring(0, 20)}...`);

      // Testar validação da senha
      const isPasswordValid = await bcrypt.compare(testCase.password, user.password);

      if (isPasswordValid) {
        console.log(`✅ Senha válida para ${testCase.email}`);
      } else {
        console.log(`❌ Senha inválida para ${testCase.email}`);

        // Testar com hash gerado na hora para comparar
        const newHash = await bcrypt.hash(testCase.password, 10);
        console.log(`   Hash teste: ${newHash.substring(0, 20)}...`);
      }
    } catch (error) {
      console.log(`❌ Erro ao testar ${testCase.email}:`, error.message);
    }

    console.log('---');
  }

  await prisma.$disconnect();
}

testCredentials().catch(console.error);
