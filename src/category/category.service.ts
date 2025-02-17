import { Injectable, Logger } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { EntityManager, Repository } from 'typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { categoryPaginateConfig } from 'src/paginate.config';
import { CategoryAddDto } from './dto/category-add.dto';
import { Resource } from 'src/resource/entities/resource.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    private readonly entityManager: EntityManager,
  ) {}

  list = async (query: PaginateQuery) => {
    return paginate(query, this.repository, categoryPaginateConfig);
  };

  create = async (dto: CategoryAddDto) => {
    this.logger.log('🚀 ~ CategoryService ~ create= ~ dto:', dto);
    const { name, description, thumbnailId, categoryId } = dto;
    let parent = null;
    if (categoryId && categoryId !== null && categoryId > 0) {
      parent = await this.repository.findOne({ where: { id: categoryId } });
      this.logger.log('🚀 ~ CategoryService ~ create= ~ parent:', parent);
    }
    const thumbnail = await this.resourceRepository.findOne({
      where: { id: thumbnailId },
    });
    this.logger.log('🚀 ~ CategoryService ~ create= ~ thumbnail:', thumbnail);
    return await this.repository.save({ name, description, thumbnail, parent });
  };
  listTree = async () => {
    return await this.entityManager
      .getTreeRepository(Category)
      .findTrees({ depth: 99, relations: ['thumbnail'] });
  };
}
