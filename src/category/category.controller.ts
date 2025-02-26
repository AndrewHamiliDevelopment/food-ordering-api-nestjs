import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { CategoryAddDto } from './dto/category-add.dto';
import { ApiBearerAuth, ApiDefaultResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { categoryPaginateConfig } from 'src/paginate.config';
import { Category } from './entities/category.entity';
import { ExtendedRequest } from 'src/shared';
import { CategoryUpdateDto } from './dto/category-update.dto';

@Controller({ path: 'categories', version: '1' })
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
  @Get('tree')
  @ApiOkResponse({ type: Category, isArray: true})
  listTree() {
    return this.categoryService.listTree();
  }
  @Post()
  @ApiResponse({type: Category})
  create(@Request() req: ExtendedRequest, @Body() dto: CategoryAddDto) {
    this.logger.log('Create', dto);
    return this.categoryService.create(req, dto);
  }
  @Patch(':id')
  @ApiResponse({type: Category})
  update(
    @Param('id') id: number,
    @Request() req: ExtendedRequest,
    @Body() dto: CategoryUpdateDto,
  ) {
    return this.categoryService.update(req, { id, dto });
  }
}
