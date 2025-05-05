import { Body, Controller, Get, Param, Post, Patch } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { ProductCreateDto } from './dto/product-create.dto';
import { productPaginateConfig } from 'src/paginate.config';
import { Product } from './entities/product.entity';
import { ProductUpdateDto } from './dto/product-update.dto';

@Controller({ path: 'products', version: '1' })
@ApiTags('Product')
@ApiBearerAuth('access-token')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiPaginationQuery(productPaginateConfig)
  @ApiOkPaginatedResponse(Product, productPaginateConfig)
  list(@Paginate() query: PaginateQuery) {
    return this.productService.list(query);
  }

  @Post()
  create(@Body() dto: ProductCreateDto) {
    return this.productService.create(dto);
  }
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: ProductUpdateDto) {
    return this.productService.update({ id, dto });
  }
}
