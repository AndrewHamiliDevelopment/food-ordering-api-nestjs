import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductSnapshot } from 'src/product/entities/product-snapshot.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { UserDetail } from 'src/users/entities/user-detail.entity';
import { ProductModule } from 'src/product/product.module';
import { ProductService } from 'src/product/product.service';
import { ResourceModule } from 'src/resource/resource.module';
import { ResourceService } from 'src/resource/resource.service';
import { CategoryModule } from 'src/category/category.module';
import { CategoryService } from 'src/category/category.service';
import { Resource } from 'src/resource/entities/resource.entity';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, User, Product, ProductSnapshot, UserDetail, Resource, Category]),
    UsersModule,
    ProductModule,
    ResourceModule,
    CategoryModule,
  ],
  controllers: [CartController],
  providers: [CartService, UsersService, ProductService, ResourceService, CategoryService],
})
export class CartModule {}
