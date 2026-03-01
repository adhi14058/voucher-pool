import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { HealthService } from './health.service';

@Controller('')
@ApiExcludeController()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('liveness')
  liveness() {
    if (this.healthService.liveness) {
      return { status: 'alive' };
    }
    throw new InternalServerErrorException('liveness check failed');
  }

  @Get('readiness')
  readiness() {
    if (this.healthService.readiness) {
      return { status: 'alive' };
    }
    throw new InternalServerErrorException('readiness check failed');
  }
}
