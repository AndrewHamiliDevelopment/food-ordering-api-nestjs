import { Body, Controller, Get, Logger, NotFoundException, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderCreateDto } from './dto/Order-create.dto';
import { ExtendedRequest } from 'src/shared';
import { ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { OrderUpdateDto } from './dto/Order-update.dto';
import { orderPaginateConfig } from 'src/paginate.config';
import { Order, PAYMENT_METHOD } from './entities/order.entity';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartService } from 'src/cart/cart.service';
import { PaymentService } from 'src/payment/payment.service';
import { CashPaymentMethod, PaypalPaymentMethod } from 'src/payment/payment.method';

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
    private readonly cashPaymentMethod: CashPaymentMethod,
  ) {
    this.paymentService.registerPaymentMethod(PAYMENT_METHOD.PAYPAL, this.paypalPaymentMethod);
    this.paymentService.registerPaymentMethod(PAYMENT_METHOD.CASH, this.cashPaymentMethod);
  }

  @Get()
  @ApiPaginationQuery(orderPaginateConfig)
  @ApiOkPaginatedResponse(Order, orderPaginateConfig)
  list(@Request() req: ExtendedRequest, @Paginate() query: PaginateQuery) {
    return this.orderService.list(req, query);
  }

  @Get('payment/methods')
  listPaymentMethods(@Request() req: ExtendedRequest) {
    this.logger.log(`protocol: ${req.protocol}`, )
    this.logger.log(`host: ${req.host}`);
    this.logger.log(`baseUrl: ${req.baseUrl}`);
    this.logger.log(`hostname ${req.hostname}`, )
    return this.orderService.paymentMethods();
  }
  @Get('payment/:uuid')
  @ApiQuery({
    name: 'paymentId',
    type: String,
    required: false
  })
  @ApiQuery({
    name: 'token',
    type: String,
    required: false
  })
  @ApiQuery({
    name: 'PayerID',
    type: String,
    required: false
  })
  async executePayment(
    @Query('paymentId') paymentId: string,
    @Query('token') token: string,
    @Query('PayerID') PayerID: string,
    @Param('uuid') uuid: string,
    @Request() req: ExtendedRequest,
  ) {
    const order = await this.orderService.getOneByUuid(uuid);
    if (order === null) {
      throw new NotFoundException('Order is invalid');
    }
    const params = new URLSearchParams();
    if(paymentId) {
      params.append('paymentId', paymentId);
    }
    if(token) {
      params.append('token', token);
    }
    if(PayerID) {
      params.append('PayerID', PayerID)
    }
      this.paymentService.executePayment(order, params);
    return order;
  }

  @Post()
  @ApiResponse({ type: Order })
  async create(@Request() req: ExtendedRequest, @Body() dto: OrderCreateDto) {
    this.logger.log('Creating Order...'); 
    const order = await this.orderService.create(req, dto);
    this.logger.log('Updating cart...');
    await this.cartService.checkout(req, { id: dto.cartId });
    await this.paymentService.processPayment(req, order);
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
