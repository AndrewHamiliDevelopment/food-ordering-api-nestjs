import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning();
  app.useGlobalPipes(new ValidationPipe({transform: true}));
  app.enableCors();

  const logger = new Logger(bootstrap.name);

  const configService = app.get<ConfigService>(ConfigService);

  const port = configService.getOrThrow<number>('PORT');
  const env = configService.getOrThrow<number>('ENV');
  const baseUrl = configService.getOrThrow<string>('APP_BASE_URL');

  const config = new DocumentBuilder()
  .setTitle('Food Ordering API')
  .setDescription('Food Ordering API')
  .addServer(`http://localhost:${port}`, 'local')
  .addServer(baseUrl, 'production')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-doc', app, document);

  await app.listen(process.env.PORT ?? 3000);

  logger.log(`Server started at port ${port}`)
  logger.log(`local access: http://localhost:${port}`)
  logger.log(`Production access: ${baseUrl}`)


}
bootstrap();
