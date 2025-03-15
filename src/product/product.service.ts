import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { productPaginateConfig } from 'src/paginate.config';
import { ProductCreateDto } from './dto/product-create.dto';
import { Resource } from 'src/resource/entities/resource.entity';
import { Category } from 'src/category/entities/category.entity';
import { each } from 'lodash';
import { ProductUpdateDto } from './dto/product-update.dto';
import { ResourceService } from 'src/resource/resource.service';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ProductService {
  private logger = new Logger(ProductService.name);
  constructor(
    @InjectRepository(Product) private readonly repository: Repository<Product>,
    private readonly resourceService: ResourceService,
    private readonly categoryService: CategoryService,
  ) {}

  getInternal = async (id: number) => {
    return await this.repository.findOne({where: {id}, relations: ['category', 'thumbnail', 'images']});
  }

  list = (query: PaginateQuery) => {
    this.logger.log('list', query);
    return paginate(query, this.repository, productPaginateConfig);
  };
  create = async (dto: ProductCreateDto) => {
    this.logger.log('dto', dto);
    const { thumbnailId, categoryId, imageIds, name, description, price } = dto;
    const thumbnail = await this.resourceService.getOneInternal(thumbnailId);
    if (thumbnail === null) {
      this.logger.error(`Thumbnail resource ID ${thumbnailId} not found.`)
      throw new BadRequestException('Thumbnail not found.');
    }
    const category = await this.categoryService.getOneInternal(categoryId);
    if(category === null) {
      this.logger.error(`Category ID ${categoryId} not found`);
      throw new BadRequestException(`Category not found`);
    }
    const uniqueImageIds = [...new Set(imageIds)];
    const images: Resource[] = [];
    await each(uniqueImageIds, async (id) => {
      const resource = await this.resourceService.getOneInternal(id);
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
      price,
    });
  };

  update = async (props: { id: number; dto: ProductUpdateDto }) => {
    const { id, dto } = props;
    const {
      name,
      description,
      price,
      categoryId,
      thumbnailId,
      enabled,
      imageIds,
    } = dto;
    const product = await this.repository.findOne({ where: { id } });
    if (product !== null) {
      const category = await this.categoryService.getOneInternal(categoryId);
      if(category === null) {
        this.logger.error(`Category ID: ${categoryId} not found.`);
        throw new BadRequestException(`Category not found.`);
      }
      const thumbnail = await this.resourceService.getOneInternal(thumbnailId);
      if(thumbnail === null) throw new BadRequestException(`Resource ID: ${thumbnailId} not found.`); 
      const uniqueImageIds = [...new Set(imageIds)];
      const images: Resource[] = [];
      await each(uniqueImageIds, async (id) => {
        const resource = await this.resourceService.getOneInternal(id)
        if (resource !== null) {
          images.push(resource);
        }
      });
      return await this.repository.save({
        ...product,
        name,
        description,
        price,
        category,
        thumbnail,
        enabled,
      });
    }
  };
}
