import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Resource } from 'src/resource/entities/resource.entity';
import { Category } from 'src/category/entities/category.entity';
import { ResourceModule } from 'src/resource/resource.module';
import { CategoryModule } from 'src/category/category.module';
import { ResourceService } from 'src/resource/resource.service';
import { CategoryService } from 'src/category/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Resource, Category]), ResourceModule, CategoryModule],
  controllers: [ProductController],
  providers: [ProductService, ResourceService, CategoryService],
})
export class ProductModule {}
