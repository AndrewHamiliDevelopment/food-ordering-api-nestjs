import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { Address } from 'src/address/entities/address.entity';
import { PaymentMethod } from 'src/payment-method/entities/payment-method.entity';
import { PaypalModule } from 'src/paypal/paypal.module';
import { PaypalService } from 'src/paypal/paypal.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Cart, CartItem, Address, PaymentMethod]), PaypalModule],
  controllers: [OrderController],
  providers: [OrderService, PaypalService],
})
export class OrderModule {}
