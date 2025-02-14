import { Controller } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  list(@Paginate() query: PaginateQuery) {
    return this.categoryService.list(query);
  }
}
