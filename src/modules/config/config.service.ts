import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config.schema';

@Injectable()
export class AppConfigService extends ConfigService<AppConfig> {}
