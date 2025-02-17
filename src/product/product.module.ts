import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Resource } from 'src/resource/entities/resource.entity';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Resource, Category])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
