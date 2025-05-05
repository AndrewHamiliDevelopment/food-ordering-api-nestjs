import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Category } from './entities/category.entity';
import { EntityManager, Repository } from 'typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { categoryPaginateConfig } from 'src/paginate.config';
import { CategoryAddDto } from './dto/category-add.dto';
import { Resource } from 'src/resource/entities/resource.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtendedRequest, isSuperUser } from 'src/shared';
import { User } from 'src/users/entities/user.entity';
import { CategoryUpdateDto } from './dto/category-update.dto';
import { ResourceService } from 'src/resource/resource.service';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
    private readonly resourceService: ResourceService,
    private readonly entityManager: EntityManager,
  ) {}

  getOneInternal = async (id: number) => {
    return await this.repository.findOne({where: {id}});
  }

  list = async (query: PaginateQuery) => {
    return paginate(query, this.repository, categoryPaginateConfig);
  };

  create = async (req: ExtendedRequest, dto: CategoryAddDto) => {
    this.logger.log('🚀 ~ CategoryService ~ create= ~ dto:', dto);
    let proceed = false;
    if (req.isBypass) {
      proceed = true;
    } else {
      const role = req.role;
      const superUser = isSuperUser({ role });
      if (superUser) {
        proceed = true;
      }
    }
    if (proceed) {
      const { name, description, thumbnailId, categoryId } = dto;
      let parent = null;
      if (categoryId && categoryId !== null && categoryId > 0) {
        parent = await this.repository.findOne({ where: { id: categoryId } });
        this.logger.log('🚀 ~ CategoryService ~ create= ~ parent:', parent);
      }
      const thumbnail = await this.resourceService.getOneInternal(thumbnailId);
      if(thumbnail === null) {
        this.logger.error(`Resource ID: ${thumbnailId} not found.`);
        throw new BadRequestException('Thumbnail not found.');
      }
      this.logger.log('🚀 ~ CategoryService ~ create= ~ thumbnail:', thumbnail);
      return await this.repository.save({
        name,
        description,
        thumbnail,
        parent,
      });
    } else {
      throw new UnauthorizedException(
        'Your account is not allowed to use this module',
      );
    }
  };
  update = async (
    req: ExtendedRequest,
    props: { dto: CategoryUpdateDto; id: number },
  ) => {
    let proceed = false;
    if (req.isBypass) {
      proceed = true;
    } else {
      const role = req.role;
      const superUser = isSuperUser({ role });
      if (superUser) {
        proceed = true;
      }
    }
    const { dto, id } = props;
    const { name, description, categoryId, thumbnailId, enabled } = dto;
    if (proceed) {
      const category = await this.repository.findOne({ where: { id } });
      if (category !== null) {
        const thumbnail = await this.resourceService.getOneInternal(thumbnailId);
        if (thumbnail === null) {
          this.logger.error(`Thumbnail ${thumbnailId} not found.`);
          throw new BadRequestException('Thumbnail not found.');
        }
        const parent = await this.repository.findOne({
          where: { id: categoryId },
        });
        return await this.repository.save({
          ...category,
          parent,
          thumbnail,
          name,
          description,
          enabled,
        });
      }
      throw new NotFoundException(`Category ID ${id} not found`);
    }
    throw new UnauthorizedException(
      'Your account is not allowed to use this module',
    );
  };
  listTree = async () => {
    return await this.entityManager
      .getTreeRepository(Category)
      .findTrees({ depth: 99, relations: ['thumbnail'] });
  };
}
