import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { catchError, tap } from 'rxjs/operators';

import { AppLogger } from '../logging/app-logger';

// prettier-ignore
const ignoreScenarios = [
  'GET /api/health/liveness 200',
  'GET /api/health/readiness 200',
];
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new AppLogger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const startTime = Date.now();
    return next.handle().pipe(
      tap(() => {
        const urlWithStatus = `${req.method} ${req.originalUrl} ${res.statusCode}`;
        if (ignoreScenarios.includes(urlWithStatus)) return;

        const timeTaken = Date.now() - startTime;
        this.logger.log(`${urlWithStatus} - TimeTaken ${timeTaken}ms`);
      }),
      catchError((err) => {
        const timeTaken = Date.now() - startTime;
        this.logger.error(
          `${req.method} ${req.originalUrl} - TimeTaken ${timeTaken}ms`,
        );
        throw err; // Re-throw the error so it doesn't get swallowed
      }),
    );
  }
}
