import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiOkPaginatedResponse, ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { CategoryAddDto } from './dto/category-add.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { categoryPaginateConfig } from 'src/paginate.config';
import { Category } from './entities/category.entity';

@Controller({ path: 'category', version: '1' })
@ApiBearerAuth('access-token')
@ApiTags('Category')
export class CategoryController {
  private logger = new Logger(CategoryController.name);
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiPaginationQuery(categoryPaginateConfig)
  @ApiOkPaginatedResponse(Category, categoryPaginateConfig)
  list(@Paginate() query: PaginateQuery) {
    this.logger.log('list', query);
    return this.categoryService.list(query);
  }
  @Post()
  create(@Body() dto: CategoryAddDto) {
    this.logger.log('Create', dto);
    return this.categoryService.create(dto);
  }
}
