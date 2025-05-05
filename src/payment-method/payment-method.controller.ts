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
import { ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { ExtendedRequest } from 'src/shared';
import { PaymentMethodAddDto } from './dto/PaymentMethodAdd.dto';
import { PaymentMethodUpdateDto } from './dto/PaymentMethodUpdate.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentMethod } from './entities/payment-method.entity';
import { paymentMethodPaginateConfig } from 'src/paginate.config';

@Controller({ path: 'payment-method', version: '1' })
@ApiBearerAuth('access-token')
@ApiTags('Payment Method')
export class PaymentMethodController {
  private logger = new Logger();
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Get()
  @ApiOkPaginatedResponse(PaymentMethod, paymentMethodPaginateConfig)
  @ApiPaginationQuery(paymentMethodPaginateConfig)
  list(@Paginate() query: PaginateQuery) {
    this.logger.log('Query', query);
    return this.paymentMethodService.list(query);
  }
  @Post()
  create(@Request() req: ExtendedRequest, @Body() dto: PaymentMethodAddDto) {
    return this.paymentMethodService.create(req, dto);
  }
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Request() req: ExtendedRequest,
    @Body() dto: PaymentMethodUpdateDto,
  ) {
    return this.paymentMethodService.update({ req, dto, id });
  }
}
