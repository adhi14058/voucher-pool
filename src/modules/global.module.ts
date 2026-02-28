import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AppConfigModule } from './config/config.module';

@Global()
@Module({
  imports: [AppConfigModule, DatabaseModule],
  controllers: [],
  providers: [],
  exports: [AppConfigModule, DatabaseModule],
})
export class GlobalModule {}
