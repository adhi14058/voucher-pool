import { Injectable, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';
import * as httpContext from 'express-http-context';
import os from 'os';
import { AppConfigService } from '../../config/config.service';
import {
  API_HEADER_CONTAINER_ID,
  API_HEADER_REQUEST_ID,
  API_HEADER_VERSION,
} from '../../../core/constants/headers-keys';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AttachCommonResponseHeadersMiddleware implements NestMiddleware {
  private readonly versionNumber: string;

  constructor(private readonly configService: AppConfigService) {
    this.versionNumber = this.configService.get('APP_VERSION', {
      infer: true,
    })!;
  }

  use(_req: Request, res: Response, next: NextFunction): void {
    const containerHash = os.hostname().split('-').pop();
    const requestId = uuidv4();
    httpContext.set(API_HEADER_REQUEST_ID, requestId);

    res.setHeader(API_HEADER_VERSION, this.versionNumber);
    res.setHeader(API_HEADER_CONTAINER_ID, containerHash ?? 'N/A');
    res.setHeader(API_HEADER_REQUEST_ID, requestId);
    next();
  }
}
