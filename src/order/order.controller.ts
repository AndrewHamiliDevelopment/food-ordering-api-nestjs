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
import { OrderService } from './order.service';
import { OrderCreateDto } from './dto/Order-create.dto';
import { ExtendedRequest } from 'src/shared';
import { ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { OrderUpdateDto } from './dto/Order-update.dto';
import { orderPaginateConfig } from 'src/paginate.config';
import { Order } from './entities/order.entity';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartService } from 'src/cart/cart.service';

@Controller({ path: 'orders', version: '1'})
@ApiBearerAuth('access-token')
@ApiTags('Orders')
export class OrderController {
  private logger = new Logger(OrderController.name);
  constructor(private readonly orderService: OrderService, private readonly cartService: CartService) {}

  @Get()
  @ApiPaginationQuery(orderPaginateConfig)
  @ApiOkPaginatedResponse(Order, orderPaginateConfig)
  list(@Request() req: ExtendedRequest, @Paginate() query: PaginateQuery) {
    return this.orderService.list(req, query);
  }

  
  @Post()
  @ApiResponse({type: Order})
  async create(@Request() req: ExtendedRequest, @Body() dto: OrderCreateDto) {
    this.logger.log('Creating Order...');
    const order = await this.orderService.create(req, dto);
    this.logger.log('Updating cart...');
    await this.cartService.checkout(req, {id: dto.cartId});
    this.logger.log('Send Order response');
    return this.orderService.getOne(req, order.id);
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
