import { Injectable, Logger } from '@nestjs/common';
import { Order } from 'src/order/entities/order.entity';
import { PaypalService } from './paypal.service';
import { each, has } from 'lodash';
import { PaymentModel } from './model/paypal/payment.model';
import { ItemModel } from './model/paypal/Item.model';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentResponseModel } from './model/paypal/payment-response.model';

export abstract class PaymentMethod {
  abstract createPayment(order: Order): void;
  abstract executePayment(order: Order): void;
}

@Injectable()
export class PaypalPaymentMethod implements PaymentMethod {
  private readonly logger = new Logger(PaypalPaymentMethod.name);
  constructor(
    private readonly paypalService: PaypalService,
    @InjectRepository(Payment) private readonly repository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}
  createPayment = async (order: Order) => {
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
    payload.returnUrl = `http://localhost:90/v1/order/payment/${order.uuid}`;
    payload.description = 'Online Food Ordering payment';
    this.logger.log(`Paypal payment payload: ${JSON.stringify(payload, null, 2)}`);
    const paypalResponse = await this.paypalService.generatePayment(payload);
    const response = new PaymentResponseModel();
    Object.assign(response, paypalResponse.data);
    this.logger.log(`🚀 ~ PaypalPaymentMethod ~ createPayment= ~ paypalResponse: ${JSON.stringify(response, null, 2)}`);
    this.logger.log('Recording payment information...');
    this.repository.save({ order, paymentMethodProps: response });
  };

  executePayment(order: Order): void {
      const {payment} = order;
      const {paymentMethodProps: props} = payment;
  }
}
