import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
} from '@nestjs/common';

@Injectable()
export class HealthService
  implements OnApplicationBootstrap, OnModuleDestroy, OnApplicationShutdown
{
  private isReady = false;
  private isAlive = false;

  get readiness(): boolean {
    return this.isReady;
  }

  get liveness(): boolean {
    return this.isAlive;
  }

  onApplicationBootstrap() {
    this.isReady = true;
    this.isAlive = true;
  }

  async onModuleDestroy() {
    this.isReady = false;
    await new Promise((r) => process.nextTick(r));
  }

  onApplicationShutdown() {
    this.isAlive = false;
  }
}
