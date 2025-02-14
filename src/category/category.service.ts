import { Injectable, Logger } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { categoryPaginateConfig } from 'src/paginate.config';
import { CategoryAddDto } from './dto/category-add.dto';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);
  constructor(private readonly repository: Repository<Category>) {}

  list = async (query: PaginateQuery) => {
    return paginate(query, this.repository, categoryPaginateConfig);
  };

  create = async (dto: CategoryAddDto) => {
    this.logger.log('🚀 ~ CategoryService ~ create= ~ dto:', dto);
    const { name, description } = dto;
    return await this.repository.save({ name, description });
  };

  update = async (dto: ) => {

  }
}
