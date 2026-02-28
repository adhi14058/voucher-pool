import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module.js';
import { AppConfigService } from './modules/config/config.service.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(AppConfigService);
  const port = configService.get('PORT', { infer: true })!;

  await app.listen(port);
}

void bootstrap();
