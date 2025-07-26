import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get config service
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Set global prefix
  const globalPrefix = configService.get<string>('app.globalPrefix', 'api');
  app.setGlobalPrefix(globalPrefix);

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('IGEM Stock Management API')
    .setDescription('API para gerenciamento de estoque do sistema IGEM')
    .setVersion('1.0')
    .addTag('inventory', 'Operações de inventário')
    .addTag('products', 'Gerenciamento de produtos')
    .addTag('warehouses', 'Gerenciamento de depósitos')
    .addTag('batches', 'Gerenciamento de lotes')
    .addTag('stock-movements', 'Movimentações de estoque')
    .addTag('notifications', 'Sistema de notificações')
    .addTag('dashboard', 'Dashboard e vendas')
    .addTag('health', 'Health checks')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'IGEM Stock API Docs',
  });

  // Start the application
  const port = configService.get<number>('app.port', 3000);
  await app.listen(port);

  console.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
  console.log(
    `📚 API Documentation is available at: http://localhost:${port}/${globalPrefix}/docs`,
  );
}

bootstrap().catch((error) => {
  console.error('❌ Error starting the application:', error);
  process.exit(1);
});
