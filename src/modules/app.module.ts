import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { GlobalModule } from './global.module';

@Module({
  imports: [GlobalModule, ApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
