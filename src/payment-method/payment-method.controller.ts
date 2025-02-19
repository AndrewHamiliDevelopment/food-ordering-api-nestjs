import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { ExtendedRequest } from 'src/shared';
import { PaymentMethodAddDto } from './dto/PaymentMethodAdd.dto';
import { PaymentMethodUpdateDto } from './dto/PaymentMethodUpdate.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller({ path: 'payment-method', version: '1' })
@ApiBearerAuth('access-token')
@ApiTags('Payment Method')
export class PaymentMethodController {
  private logger = new Logger();
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Get()
  list(@Paginate() query: PaginateQuery) {
    this.logger.log('Query', query);
    return this.paymentMethodService.list(query);
  }
  @Post()
  create(@Request() req: ExtendedRequest, @Body() dto: PaymentMethodAddDto) {
    return this.paymentMethodService.create(req, dto);
  }
  @Patch('id')
  update(
    @Param('id') id: number,
    @Request() req: ExtendedRequest,
    @Body() dto: PaymentMethodUpdateDto,
  ) {
    return this.paymentMethodService.update({ req, dto, id });
  }
}
