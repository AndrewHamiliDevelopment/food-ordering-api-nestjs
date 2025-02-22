import { Body, Controller, Get, Patch, Post, Request } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderCreateDto } from './dto/Order-create.dto';
import { ExtendedRequest } from 'src/shared';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { OrderUpdateDto } from './dto/Order-update.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  list(@Request() req: ExtendedRequest, @Paginate() query: PaginateQuery) {
    return this.orderService.list(req, query);
  }

  @Post()
  create(@Request() req: ExtendedRequest, @Body() dto: OrderCreateDto) {
    return this.orderService.create(req, dto);
  }

  @Patch()
  update(@Request() req: ExtendedRequest, @Body() dto: OrderUpdateDto) {
    return this.orderService.update(req, dto);
  }
}
