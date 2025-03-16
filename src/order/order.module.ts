import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { Address } from 'src/address/entities/address.entity';
import { PaymentMethod } from 'src/payment-method/entities/payment-method.entity';
import { CartModule } from 'src/cart/cart.module';
import { CartService } from 'src/cart/cart.service';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductSnapshot } from 'src/product/entities/product-snapshot.entity';
import { AddressModule } from 'src/address/address.module';
import { AddressService } from 'src/address/address.service';
import { PaymentMethodModule } from 'src/payment-method/payment-method.module';
import { PaymentMethodService } from 'src/payment-method/payment-method.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { ProductModule } from 'src/product/product.module';
import { ProductService } from 'src/product/product.service';
import { UserDetail } from 'src/users/entities/user-detail.entity';
import { ResourceModule } from 'src/resource/resource.module';
import { ResourceService } from 'src/resource/resource.service';
import { CategoryModule } from 'src/category/category.module';
import { CategoryService } from 'src/category/category.service';
import { Resource } from 'src/resource/entities/resource.entity';
import { Category } from 'src/category/entities/category.entity';
import { PaymentModule } from 'src/payment/payment.module';
import { PaymentService } from 'src/payment/payment.service';
import { CashPaymentMethod, PaypalPaymentMethod } from 'src/payment/payment.method';
import { PaypalService } from 'src/payment/paypal.service';
import { Payment } from 'src/payment/entities/payment.entity';
import { CashService } from 'src/payment/cash.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      Cart,
      CartItem,
      ProductSnapshot,
      Address,
      PaymentMethod,
      User,
      UserDetail,
      Product,
      Resource,
      Category,
      Payment,
    ]),
    CartModule,
    AddressModule,
    PaymentMethodModule,
    UsersModule,
    ProductModule,
    ResourceModule,
    CategoryModule,
    PaymentModule,
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    CartService,
    AddressService,
    PaymentMethodService,
    UsersService,
    ProductService,
    ResourceService,
    CategoryService,
    PaymentService,
    PaypalPaymentMethod,
    CashPaymentMethod,
    PaypalService,
    CashService,
  ],
})
export class OrderModule {}
