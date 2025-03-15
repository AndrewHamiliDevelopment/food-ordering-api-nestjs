import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from 'src/resource/entities/resource.entity';
import { Category } from './entities/category.entity';
import { ResourceModule } from 'src/resource/resource.module';
import { ResourceService } from 'src/resource/resource.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Resource]), ResourceModule],
  controllers: [CategoryController],
  providers: [CategoryService, ResourceService],
})
export class CategoryModule {}
