import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaypalService } from './paypal.service';

@Module({
  providers: [PaymentService, PaypalService]
})
export class PaymentModule {}
