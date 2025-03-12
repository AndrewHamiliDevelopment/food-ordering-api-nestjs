import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { each } from 'lodash';
import { CartItem } from 'src/cart/entities/cart-item.entity';

export interface PayItem {
    name: string;
    description: string;
    quantity: number;
    price: number;
    currency: string;
    tax: 0
}
export interface PayResponse {
    links: Links[];
}
export interface Links {
    href: string;
    rel: string;
    method: string;
}


@Injectable()
export class PaypalService {
    private axiosInstance: AxiosInstance;
    private readonly logger = new Logger(PaypalService.name);
    constructor(private readonly configService: ConfigService) {        
        const baseURL = this.configService.getOrThrow<string>('PAYPAL_GATEWAY_BASE_URL');
        this.axiosInstance = axios.create({baseURL});
    }

    generatePaymentRequest = async (cartItems: CartItem[]): Promise<AxiosResponse<Links>> => {
        this.logger.log("🚀 ~ PaypalService ~ generatePaymentRequest= ~ cartItems:", cartItems)
        const paymentItems: PayItem[] = [];
        await each(cartItems, async (cartItem) => {
            const {product, quantity} = cartItem;
            paymentItems.push({
                name: product.name,
                description: product.description,
                price: product.price,
                currency: "PHP",
                quantity,
                tax: 0
            });
        });
        this.logger.log("🚀 ~ PaypalService ~ generatePaymentRequest= ~ paymentItems:", paymentItems)
        return this.axiosInstance.post('/pay', {items: paymentItems});
    }
}