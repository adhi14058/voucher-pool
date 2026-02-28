import { Module } from '@nestjs/common';
import { ServerHealthModule } from './health/health.module';

@Module({
  imports: [ServerHealthModule],
  controllers: [],
  providers: [],
})
export class ApiModule {}
