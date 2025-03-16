import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentMethod } from './payment.method';
import { Order, PAYMENT_METHOD } from 'src/order/entities/order.entity';
import { method } from 'lodash';

@Injectable()
export class PaymentService {

    private paymentMethods: Record<string, PaymentMethod> = {};
    

    public registerPaymentMethod(paymentMethod: PAYMENT_METHOD, method: PaymentMethod) {
        this.paymentMethods[paymentMethod] = method;
    }

    processPayment = async (order: Order) => {
        const {paymentMethod} = order;
        const method = this.paymentMethods[paymentMethod];
        if(method) {
            await method.createPayment(order);
        } else {
            throw new Error('Unsupported payment method')
        }
    }
    executePayment = async (order: Order) => {
        const {paymentMethod} = order;
        const method = this.paymentMethods[paymentMethod];
        if(method) {
            await method.executePayment(order);
        } else {
            throw new Error('Unsupported payment method');
        }
    }

}
