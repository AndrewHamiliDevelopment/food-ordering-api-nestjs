import { Body, Controller, Get, Logger, Param, Patch, Post, Request } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderCreateDto } from './dto/Order-create.dto';
import { ExtendedRequest } from 'src/shared';
import { ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { OrderUpdateDto } from './dto/Order-update.dto';
import { orderPaginateConfig } from 'src/paginate.config';
import { Order, PAYMENT_METHOD } from './entities/order.entity';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartService } from 'src/cart/cart.service';
import { PaymentService } from 'src/payment/payment.service';
import { PaypalPaymentMethod } from 'src/payment/payment.method';

@Controller({ path: 'orders', version: '1' })
@ApiBearerAuth('access-token')
@ApiTags('Orders')
export class OrderController {
  private logger = new Logger(OrderController.name);
  constructor(
    private readonly orderService: OrderService,
    private readonly cartService: CartService,
    private readonly paymentService: PaymentService,
    private readonly paypalPaymentMethod: PaypalPaymentMethod,
  ) {
    this.paymentService.registerPaymentMethod(PAYMENT_METHOD.PAYPAL, paypalPaymentMethod)
  }

  @Get()
  @ApiPaginationQuery(orderPaginateConfig)
  @ApiOkPaginatedResponse(Order, orderPaginateConfig)
  list(@Request() req: ExtendedRequest, @Paginate() query: PaginateQuery) {
    return this.orderService.list(req, query);
  }

  @Get('payment/:uuid')
  async executePayment(@Param('uuid') uuid: string, @Request() req: ExtendedRequest) {
    const order = await this.orderService.getOneByUuid(uuid);
    this.paymentService.executePayment(order);
    return order;
  }


  @Post()
  @ApiResponse({ type: Order })
  async create(@Request() req: ExtendedRequest, @Body() dto: OrderCreateDto) {
    this.logger.log('Creating Order...');
    const order = await this.orderService.create(req, dto);
    this.logger.log('Updating cart...');
    await this.cartService.checkout(req, { id: dto.cartId });
    await this.paymentService.processPayment(order);
    this.logger.log('Send Order response');
    return await this.orderService.getOne(req, order.id);
  }

  @Get(':id')
  getOne(@Param('id') id: number, @Request() req: ExtendedRequest) {
    return this.orderService.getOne(req, id);
  }

  @Patch(':id')
  @ApiResponse({ type: Order })
  update(@Param('id') id: number, @Request() req: ExtendedRequest, @Body() dto: OrderUpdateDto) {
    return this.orderService.update(req, { dto, id });
  }
}
