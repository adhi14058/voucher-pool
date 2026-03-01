import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Request, Response } from 'express';
import * as httpContext from 'express-http-context';
import { AppLogger } from '../logging/app-logger';
import { API_HEADER_REQUEST_ID } from '../constants/headers-keys';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new AppLogger(CustomExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorDetails = exception.getResponse();
      const err =
        typeof errorDetails === 'string'
          ? errorDetails
          : JSON.stringify(errorDetails);
      this.logger.error(
        `${request?.method} ${request?.originalUrl} ${status} error: ${exception.message}: Details: ${err}`,
      );
      return response.status(status).json({
        statusCode: status,
        errorDetails,
        requestId: httpContext.get(API_HEADER_REQUEST_ID) as string,
      });
    } else {
      const status = HttpStatus.INTERNAL_SERVER_ERROR;
      this.logger.error(
        `${request?.method} ${request?.originalUrl} ${status} error: ${exception.message}`,
        exception.stack,
      );
      return response.status(status).json({
        statusCode: status,
        requestId: httpContext.get(API_HEADER_REQUEST_ID) as string,
        errorDetails: {
          message: 'Something went wrong, please try again later',
        },
      });
    }
  }
}
