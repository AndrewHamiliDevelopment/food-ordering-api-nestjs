import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from 'src/resource/entities/resource.entity';
import { Category } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Resource])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
