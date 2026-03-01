import { Global, Module, ValidationPipe } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AppConfigModule } from './config/config.module';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';

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
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
  ],
  exports: [AppConfigModule, DatabaseModule],
})
export class GlobalModule {}
