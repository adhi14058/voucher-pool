import { Routes } from '@nestjs/core';
import { ServerHealthModule } from './health/health.module';

export const getApiRoutes = (): Routes => {
  const apiRoutes: Routes = [
    { path: 'api/health', module: ServerHealthModule },
    {
      path: 'api/v1',
    },
  ];

  return apiRoutes;
};
