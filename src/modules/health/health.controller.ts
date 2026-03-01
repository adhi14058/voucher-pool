import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { HealthService } from './health.service';

@Controller('')
@ApiExcludeController()
@SkipThrottle()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('liveness')
  liveness() {
    if (this.healthService.liveness) {
      return { status: 'alive' };
    }
    throw new ServiceUnavailableException('Service not alive');
  }

  @Get('readiness')
  readiness() {
    if (this.healthService.readiness) {
      return { status: 'ready' };
    }
    throw new ServiceUnavailableException('Service not ready');
  }
}
