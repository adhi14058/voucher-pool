import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '../../../prisma/db-client';
import { PrismaPg } from '@prisma/adapter-pg';
import { AppConfigService } from '../config/config.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);
  constructor(readonly configService: AppConfigService) {
    const databaseUrl = configService.get('DATABASE_URL', { infer: true });
    super({
      adapter: new PrismaPg({
        connectionString: databaseUrl,
      }),
      transactionOptions: {
        maxWait: 10000,
        timeout: 10000,
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to prisma client');
  }

  async onApplicationShutdown() {
    await this.$disconnect();
  }
}

export { Prisma, PrismaClient };
