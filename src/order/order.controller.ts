import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  ServiceUnavailableException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderCreateDto } from './dto/Order-create.dto';
import { ExtendedRequest } from 'src/shared';
import { ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { OrderUpdateDto } from './dto/Order-update.dto';
import { orderPaginateConfig } from 'src/paginate.config';
import { Order, PAYMENT_METHOD, STATUS } from './entities/order.entity';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartService } from 'src/cart/cart.service';
import { PaymentService } from 'src/payment/payment.service';
import { CashPaymentMethod, PaypalPaymentMethod } from 'src/payment/payment.method';

enum OrderStep {
  CREATE = 'CREATE',
  UPDATE_CART = 'UPDATE CART',
  PAYMENT_PROCESS = 'PROCESS PAYMENT',
  UPDATE_ORDER_STATUS = 'UPDATE ORDER STATUS',
  DONE = 'DONE',
  PAYMENT_EXECUTION = 'EXECUTE PAYMENT'
}

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
    this.logger.log(`protocol: ${req.protocol}`);
    this.logger.log(`host: ${req.host}`);
    this.logger.log(`baseUrl: ${req.baseUrl}`);
    this.logger.log(`hostname ${req.hostname}`);
    return this.orderService.paymentMethods();
  }
  @Get('payment/:uuid')
  @ApiQuery({
    name: 'paymentId',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'token',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'PayerID',
    type: String,
    required: false,
  })
  async executePayment(
    @Query('paymentId') paymentId: string,
    @Query('token') token: string,
    @Query('PayerID') PayerID: string,
    @Param('uuid') uuid: string,
  ) {
    let order = await this.orderService.getOneByUuid(uuid);
    if (order === null) {
      throw new NotFoundException('Order is invalid');
    }
    const params = new URLSearchParams();
    if (paymentId) {
      params.append('paymentId', paymentId);
    }
    if (token) {
      params.append('token', token);
    }
    if (PayerID) {
      params.append('PayerID', PayerID);
    }
    try {
      await this.paymentService.executePayment(order, params);
      order = await  this.orderService.updateInternal(order.id, {status: STATUS.PAID});
      return order;
    } catch (error) {
      this.logger.error('error', error);
    }
    throw new InternalServerErrorException('An internal server error has occurred');
  }

  @Post()
  @ApiResponse({ type: Order })
  async create(@Request() req: ExtendedRequest, @Body() dto: OrderCreateDto) {
    let currentStep: OrderStep | null = null;
    let order: Order | null = null;
    try {
      this.logger.log('Creating Order...');
      currentStep = OrderStep.CREATE;
      order = await this.orderService.create(req, dto);
      this.logger.log('Updating cart...');
      currentStep = OrderStep.UPDATE_CART;
      await this.cartService.checkout(req, { id: dto.cartId });
      this.logger.log('Process payment...');
      currentStep = OrderStep.PAYMENT_PROCESS;
      const payment = await this.paymentService.processPayment(req, order);
      this.logger.log('Update Order status');
      currentStep = OrderStep.UPDATE_ORDER_STATUS;
      this.orderService.updateInternal(order.id, { status: STATUS.UNPAID });
      this.logger.log('Send Order response');
      currentStep = OrderStep.DONE;
      return await this.orderService.getOne(req, order.id);
    } catch (error) {
      this.logger.error('error', error);
      throw new InternalServerErrorException(
        `An error has occurred while processing the transaction. The last known step for your Order ID ${order.id} was on ${currentStep}`,
      );
    }
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
