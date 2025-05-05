import { Injectable, InternalServerErrorException, Logger, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { Order, STATUS } from 'src/order/entities/order.entity';
import { PaypalService } from './paypal.service';
import { each, has } from 'lodash';
import { PaymentModel } from './model/paypal/payment.model';
import { ItemModel } from './model/paypal/Item.model';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentResponseModel } from './model/paypal/payment-response.model';
import { CashService } from './cash.service';
import { of } from 'rxjs';
import { ExtendedRequest } from 'src/shared';
import { OrderService } from 'src/order/order.service';

export abstract class PaymentMethod {
  abstract createPayment(req: ExtendedRequest, order: Order): void;
  abstract executePayment(order: Order, params?: URLSearchParams): void;
}

@Injectable()
export class PaypalPaymentMethod implements PaymentMethod {
  private readonly logger = new Logger(PaypalPaymentMethod.name);
  constructor(
    private readonly paypalService: PaypalService,
    @InjectRepository(Payment) private readonly repository: Repository<Payment>,
    private readonly orderService: OrderService,
  ) {}
  createPayment = async (req: ExtendedRequest, order: Order) => {
    const currency = 'PHP';
    this.logger.log(`Create paypal payment for Order ID: ${order.id}`);
    const payload = new PaymentModel();
    const orderItems: ItemModel[] = [];
    const { cart } = order;
    const { cartItems } = cart;
    await each(cartItems, async (item) => {
      const { product, quantity } = item;
      const { name, description, price } = product;
      orderItems.push({ name, description, price, quantity, currency });
    });
    payload.items = orderItems;
    payload.returnUrl = `${req.protocol}://${req.host}/v1/orders/payment/${order.uuid}`;
    payload.description = 'Online Food Ordering payment';
    this.logger.log(`Paypal payment payload: ${JSON.stringify(payload, null, 2)}`);
    const paypalResponse = await this.paypalService.generatePayment(payload);
    const response = new PaymentResponseModel();
    Object.assign(response, paypalResponse.data);
    this.logger.log(`🚀 ~ PaypalPaymentMethod ~ createPayment= ~ paypalResponse: ${JSON.stringify(response, null, 2)}`);
    this.logger.log('Recording payment information...');
    this.repository.save({ order, paymentMethodProps: response });
  };

  executePayment = async (order: Order, params: URLSearchParams) => {
    const { payment } = order;
    const { paymentMethodProps: props } = payment;
    const paymentProps = new PaymentResponseModel();
    Object.assign(paymentProps, props);
    try {
      if (params) {
        let inquiry = params.has('paymentId');
        let execute = params.has('token') && params.has('PayerID');
        if (inquiry && execute) {
          const paymentId = params.get('paymentId');
          const token = params.get('token');
          const PayerID = params.get('PayerID');
          const response = await this.paypalService.executePayment({ paymentId, token, PayerID });
          const prm = new PaymentResponseModel();
          Object.assign(prm, response.data);
          if (paymentProps.id === prm.id) {
            this.logger.log('Order match!');
            return;
          }
        } else if (inquiry) {
          const paymentId = params.get('paymentId');
          const response = await this.paypalService.executePayment({ paymentId });
        }
      }
    } catch (error) {
      this.logger.error('Error', error);
    }
    throw new InternalServerErrorException();
  };
}

@Injectable()
export class CashPaymentMethod implements PaymentMethod {
  private logger = new Logger(CashPaymentMethod.name);
  constructor(
    private readonly cashService: CashService,
    @InjectRepository(Payment) private readonly repository: Repository<Payment>,
    private readonly orderService: OrderService,
  ) {}
  createPayment = async (req: ExtendedRequest, order: Order) => {
    this.logger.log(`Order: ${JSON.stringify(order)}`);
    this.logger.log('Cash Payment Method.');
    this.logger.log('Nothing to process.');
    this.logger.log(`Set Status to ${STATUS.PROCESSING}`);
    const paymentObject = { totalAmount: await this.cashService.generatePayment(order) };
    this.repository.save({ order, paymentMethodProps: paymentObject });
  };
  executePayment(order: Order): void {
    this.logger.log(`Order: ${JSON.stringify(order)}`);
    this.logger.log('Cash payment');
    this.logger.log('Nothing to do here.');
  }
}
