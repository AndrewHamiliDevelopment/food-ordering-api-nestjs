import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { productPaginateConfig } from 'src/paginate.config';
import { ProductCreateDto } from './dto/product-create.dto';
import { Resource } from 'src/resource/entities/resource.entity';
import { Category } from 'src/category/entities/category.entity';
import { each } from 'lodash';

@Injectable()
export class ProductService {
  private logger = new Logger(ProductService.name);
  constructor(
    @InjectRepository(Product) private readonly repository: Repository<Product>,
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  list = (query: PaginateQuery) => {
    this.logger.log('list', query);
    return paginate(query, this.repository, productPaginateConfig);
  };
  create = async (dto: ProductCreateDto) => {
    this.logger.log('dto', dto);
    const { thumbnailId, categoryId, imageIds, name, description } = dto;
    const thumbnail = await this.resourceRepository.findOne({
      where: { id: thumbnailId },
    });
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    const uniqueImageIds = [...new Set(imageIds)];
    const images: Resource[] = [];
    await each(uniqueImageIds, async (id) => {
      const resource = await this.resourceRepository.findOne({ where: { id } });
      if (resource !== null) {
        images.push(resource);
      }
    });
    return await this.repository.save({
      name,
      description,
      category,
      thumbnail,
      images,
    });
  };
}
