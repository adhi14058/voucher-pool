import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfigService } from './modules/config/config.service.js';
import { ENVIRONMENTS } from './modules/config/config.constants.js';

export const setupSwagger = (
  app: INestApplication,
  configService: AppConfigService,
): void => {
  //If swagger needs to disabled in production, return early
  const env = configService.get('CONFIG_ENVIRONMENT', { infer: true });
  if (env === ENVIRONMENTS.PRODUCTION) {
    return;
  }

  const config = new DocumentBuilder()
    .setTitle('Voucher Pool API')
    .setDescription(
      'REST API for managing voucher codes, customers, and special offers',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);
};
