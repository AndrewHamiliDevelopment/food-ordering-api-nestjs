import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FirebaseMiddleware } from './firebase/firebase.middleware';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { ResourceModule } from './resource/resource.module';
import { UsersController } from './users/users.controller';
import { ResourceController } from './resource/resource.controller';
import { CategoryController } from './category/category.controller';
import { ProductModule } from './product/product.module';
import { ProductController } from './product/product.controller';
import { CartModule } from './cart/cart.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { CartController } from './cart/cart.controller';
import { PaymentMethodController } from './payment-method/payment-method.controller';
import { SmtpmailerModule } from './smtpmailer/smtpmailer.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrderModule } from './order/order.module';
import { AddressModule } from './address/address.module';
import { AddressController } from './address/address.controller';
import { OrderController } from './order/order.controller';
import { PaypalModule } from './paypal/paypal.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    DatabaseModule,
    CategoryModule,
    ResourceModule,
    ProductModule,
    CartModule,
    PaymentMethodModule,
    SmtpmailerModule,
    OrderModule,
    AddressModule,
    PaypalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FirebaseMiddleware)
      .exclude(
        { path: '/v1/categories', method: RequestMethod.GET },
        { path: '/v1/categories/tree', method: RequestMethod.GET },
        { path: '/v1/payment-method', method: RequestMethod.GET },
        { path: '/v1/products', method: RequestMethod.GET },
        { path: '/v1/resource/file/:id', method: RequestMethod.GET },
      )
      .forRoutes(
        UsersController,
        ResourceController,
        CategoryController,
        ProductController,
        CartController,
        PaymentMethodController,
        AddressController,
        OrderController
      );
  }
}
