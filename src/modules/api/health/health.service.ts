import { Injectable, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class HealthService implements OnModuleDestroy {
  private isReady = true;
  private isAlive = true;

  get readiness(): boolean {
    return this.isReady;
  }

  set readiness(isReady: boolean) {
    this.isReady = isReady;
  }

  get liveness(): boolean {
    return this.isAlive;
  }

  onModuleDestroy() {
    this.isReady = false; // Set readiness to false when the module is destroyed
  }

  markAsNotAlive() {
    this.isAlive = false; // Set liveness to false (e.g., when a critical error occurs)
  }
}
