import { Injectable } from "@nestjs/common";
import { each } from "lodash";
import { Order } from "src/order/entities/order.entity";

@Injectable()
export class CashService{
    generatePayment = async (order: Order) => {
        const {cart} = order;
        const {cartItems} = cart;
        const totalAmount = cartItems.map((item) => item.product.price * item.quantity);
        const grandTotal = totalAmount.reduce((sum, current) => sum + current);
        return grandTotal;
    }
}