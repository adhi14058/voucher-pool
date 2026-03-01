import { Routes } from '@nestjs/core';
import { ServerHealthModule } from '../health/health.module';
import { CustomersModule } from '../customers/customers.module';
import { SpecialOffersModule } from '../special-offers/special-offers.module';
import { VouchersModule } from '../vouchers/vouchers.module';

// Health route is intentionally unversioned
export const API_ROUTES: Routes = [
  { path: 'api/health', module: ServerHealthModule },
  {
    path: 'api/v1',
    children: [
      { path: 'customers', module: CustomersModule },
      { path: 'special-offers', module: SpecialOffersModule },
      { path: 'vouchers', module: VouchersModule },
    ],
  },
];
