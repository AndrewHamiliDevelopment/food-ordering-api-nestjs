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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller({ path: 'orders', version: '1'})
@ApiBearerAuth('access-token')
@ApiTags('Orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ApiPaginationQuery(orderPaginateConfig)
  @ApiOkPaginatedResponse(Order, orderPaginateConfig)
  list(@Request() req: ExtendedRequest, @Paginate() query: PaginateQuery) {
    return this.orderService.list(req, query);
  }

  
  @Post()
  @ApiResponse({type: Order})
  create(@Request() req: ExtendedRequest, @Body() dto: OrderCreateDto) {
    return this.orderService.create(req, dto);
  }
  
  @Get(':id')
  getOne(@Param('id') id: number, @Request() req: ExtendedRequest) {
    return this.orderService.getOne(req, id);
  }

  @Patch(':id')
  @ApiResponse({type: Order})
  update(
    @Param('id') id: number,
    @Request() req: ExtendedRequest,
    @Body() dto: OrderUpdateDto,
  ) {
    return this.orderService.update(req, { dto, id });
  }
}
