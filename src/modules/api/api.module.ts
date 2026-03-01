import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ServerHealthModule } from '../health/health.module';
import { CustomersModule } from '../customers/customers.module';
import { SpecialOffersModule } from '../special-offers/special-offers.module';
import { VouchersModule } from '../vouchers/vouchers.module';
import { RouterModule } from '@nestjs/core';
import { API_ROUTES } from './api.routes';
import { CommonResponseHeadersMiddleware } from './middlewares/common-headers.middleware';

@Module({
  imports: [
    ServerHealthModule,
    CustomersModule,
    SpecialOffersModule,
    VouchersModule,
    RouterModule.register(API_ROUTES),
  ],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CommonResponseHeadersMiddleware).forRoutes('*');
  }
}
