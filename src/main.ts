import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';

import * as httpContext from 'express-http-context';
import express from 'express';

import { AppModule } from './modules/app.module.js';
import { AppConfigService } from './modules/config/config.service.js';
import { setupSwagger } from './swagger.js';
import { isDevEnv } from './modules/config/config.utils.js';

const logger = new Logger('Main');
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(httpContext.middleware);
  app.use(express.json({ limit: '5mb' }));
  app.enableCors({
    origin: isDevEnv() ? '*' : '<your-frontend-url>',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // if we are using cookies
  });

  setupSwagger(app);

  const configService = app.get(AppConfigService);
  const PORT = configService.get('PORT', { infer: true })!;

  // enable shutdown hooks to gracefully shutdown the server
  app.enableShutdownHooks();
  await app.listen(PORT);
  logger.log(`Server is running on port ${PORT}`);
}

void bootstrap();
