import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderCreateDto } from './dto/Order-create.dto';
import { ExtendedRequest } from 'src/shared';
import { ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { OrderUpdateDto } from './dto/Order-update.dto';
import { orderPaginateConfig } from 'src/paginate.config';
import { Order } from './entities/order.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ApiPaginationQuery(orderPaginateConfig)
  @ApiOkPaginatedResponse(Order, orderPaginateConfig)
  list(@Request() req: ExtendedRequest, @Paginate() query: PaginateQuery) {
    return this.orderService.list(req, query);
  }

  @Post()
  create(@Request() req: ExtendedRequest, @Body() dto: OrderCreateDto) {
    return this.orderService.create(req, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Request() req: ExtendedRequest,
    @Body() dto: OrderUpdateDto,
  ) {
    return this.orderService.update(req, { dto, id });
  }
}
