import { Injectable, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class HealthService implements OnModuleDestroy {
  private isReady: boolean;
  private isAlive: boolean;

  get readiness(): boolean {
    return this.isReady ?? false;
  }
  get liveness(): boolean {
    return this.isAlive ?? false;
  }

  onApplicationBootstrap() {
    this.isReady = true;
    this.isAlive = true;
  }

  async onModuleDestroy() {
    this.isReady = false; // Set readiness to false when the module is destroyed
    await new Promise((r) => process.nextTick(r));
  }

  onApplicationShutdown() {
    this.isAlive = false; // Set liveness to false (e.g., when a critical error occurs)
  }
}
