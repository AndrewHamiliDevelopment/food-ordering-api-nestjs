import { Injectable, Logger } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Repository } from 'typeorm';
import { Resource } from './entities/resource.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { resourcePaginateConfig } from 'src/paginate.config';

@Injectable()
export class ResourceService {
  private logger = new Logger(ResourceService.name);
  constructor(private readonly repository: Repository<Resource>) {}

  list = (query: PaginateQuery) => {
    return paginate(query, this.repository, resourcePaginateConfig);
  };

  create = async (dto: CreateResourceDto) => {
    this.logger.log('🚀 ~ ResourceService ~ create= ~ dto:', dto);
    return await this.repository.save({});
  };
}
