import { Controller, Get, Logger } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('payment-method')
export class PaymentMethodController {
  private logger = new Logger();
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Get()
  list(@Paginate() query: PaginateQuery) {
    this.logger.log('Query', query);
    return this.paymentMethodService.list(query);
  }
}
