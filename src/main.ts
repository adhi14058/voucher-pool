import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import * as httpContext from 'express-http-context';
import express from 'express';
import helmet from 'helmet';

import { AppModule } from './modules/app.module.js';
import { AppConfigService } from './modules/config/config.service.js';
import { setupSwagger } from './swagger.js';
import { AppLogger } from './core/logging/app-logger.js';

const logger = new AppLogger('bootstrap');

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(AppConfigService);

  app.use(httpContext.middleware);
  app.use(express.json({ limit: '100kb' }));

  app.enableCors({
    origin: '<your-frontend-url>',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  app.use(helmet());

  setupSwagger(app, configService);

  const PORT = configService.get('PORT', { infer: true })!;

  // enable shutdown hooks to gracefully shutdown the server
  app.enableShutdownHooks();
  await app.listen(PORT);
  logger.log(`Server is running on port ${PORT}`);
}

void bootstrap().catch((err) => {
  logger.error(err);
  process.exit(1);
});
