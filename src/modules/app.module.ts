import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ApiModule } from './api/api.module';
import { GlobalModule } from './global.module';

@Module({
  imports: [
    GlobalModule,
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 100 }],
    }),
    ApiModule,
  ],
  controllers: [],
})
export class AppModule {}
