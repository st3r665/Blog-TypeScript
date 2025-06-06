import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors(); 
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();