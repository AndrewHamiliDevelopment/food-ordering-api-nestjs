import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductSnapshot } from 'src/product/entities/product-snapshot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, User, Product, ProductSnapshot]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
