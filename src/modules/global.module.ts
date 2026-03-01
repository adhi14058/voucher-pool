import { Global, Module, ValidationPipe } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AppConfigModule } from './config/config.module';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { CustomExceptionFilter } from '../core/exception-filters/custom-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { LoggingInterceptor } from '../core/interceptors/logging.interceptor';

@Global()
@Module({
  imports: [AppConfigModule, DatabaseModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
  exports: [AppConfigModule, DatabaseModule],
})
export class GlobalModule {}
