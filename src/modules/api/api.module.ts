import { Module } from '@nestjs/common';
import { ServerHealthModule } from './health/health.module';
import { RouterModule } from '@nestjs/core';
import { getApiRoutes } from './api.routes';

@Module({
  imports: [
    ServerHealthModule,

    //router
    RouterModule.register(getApiRoutes()),
  ],
  controllers: [],
  providers: [],
})
export class ApiModule {}
