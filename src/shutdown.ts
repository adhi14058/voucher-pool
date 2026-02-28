import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HealthService } from './modules/api/health/health.service';

export const gracefulShutdown = (app: NestExpressApplication) => {
  const logger = new Logger('Shutdown');

  const healthService = app.get(HealthService);

  async function gracefulShutdown() {
    logger.log('SIGTERM signal received: marking as not ready...');
    // First we mark the server as shutting down. This will cause the readiness
    // probe endpoint to start sending 500 status codes, causing kubernetes to
    // not send more traffic to us.
    healthService.readiness = false;

    logger.log('Letting kubernetes know that we are shutting down...');
    const READINESS_PROBE_INTERVAL = 1000 * 5; //5 seconds
    await new Promise((resolve) =>
      setTimeout(resolve, READINESS_PROBE_INTERVAL),
    );
    logger.log('Stopping server from accepting new connections...');

    await new Promise((r) => process.nextTick(r));

    await app.close();
    logger.log('Shutdown completed.');
  }

  // Handle SIGTERM
  process.on('SIGTERM', () => {
    void gracefulShutdown().then(() => {
      process.exit(0);
    });
  });

  // Handle uncaught exceptions and unhandled rejections
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception:', err);
    healthService.markAsNotAlive();
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled rejection:', undefined, { promise, reason });
  });
};
