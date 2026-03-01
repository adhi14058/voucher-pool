import { Logger } from '@nestjs/common';

import * as httpContext from 'express-http-context';
import { isDevEnv } from '../../modules/config/config.utils';
import { API_HEADER_REQUEST_ID } from '../constants/headers-keys';

export class AppLogger extends Logger {
  private attachRequestContext = (message: string) => {
    const rId = httpContext.get(API_HEADER_REQUEST_ID) as string;
    if (rId) message = `[ReqID: ${rId}] ${message}`;
    return message;
  };
  log = (message: string) => {
    super.log(this.attachRequestContext(message));
  };
  error = (message: string, trace?: string) => {
    if (trace) {
      super.error(this.attachRequestContext(message), trace);
      return;
    }
    super.error(this.attachRequestContext(message));
  };
  warn = (message: string) => {
    super.warn(this.attachRequestContext(message));
  };
  debug = (message: string) => {
    if (!isDevEnv()) return;
    super.debug(this.attachRequestContext(message));
  };
}
