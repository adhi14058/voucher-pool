import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ServerHealthModule } from '../health/health.module';
import { CustomersModule } from '../customers/customers.module';
import { SpecialOffersModule } from '../special-offers/special-offers.module';
import { VouchersModule } from '../vouchers/vouchers.module';
import { RouterModule } from '@nestjs/core';
import { getApiRoutes } from './api.routes';
import { AttachCommonResponseHeadersMiddleware } from './middlewares/common-headers.middleware';

@Module({
  imports: [
    ServerHealthModule,
    CustomersModule,
    SpecialOffersModule,
    VouchersModule,

    //router
    RouterModule.register(getApiRoutes()),
  ],
  controllers: [],
  providers: [],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AttachCommonResponseHeadersMiddleware).forRoutes('*');
  }
}
