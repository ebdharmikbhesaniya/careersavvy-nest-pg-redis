/* eslint-disable @typescript-eslint/no-floating-promises */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BaseExceptionFilter } from './exception/BaseExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS (optional, but recommended for frontend APIs)
  app.enableCors();

  app.useGlobalFilters(new BaseExceptionFilter());

  // Use global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove non-whitelisted properties
      forbidNonWhitelisted: true, // throw error if extra props are sent
      transform: true, // enable @Transform decorators in DTOs
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 Server is running at http://localhost:${port}`);
}

bootstrap();
