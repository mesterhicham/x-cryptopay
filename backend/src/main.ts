import 'reflect-metadata';
import * as crypto from 'crypto';

// Polyfill for crypto.randomUUID() in some Node 18 environments
if (!global.crypto) {
  (global as any).crypto = crypto;
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files (logos, favicons, etc)
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/',
  });

  // Security: Restrict CORS to specific origins
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true,
  });

  // Security: HTTP headers protection (XSS, clickjacking, etc.)
  app.use(helmet());

  // Security: Reject unexpected properties in request body
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
