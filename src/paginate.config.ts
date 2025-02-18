import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { User } from './users/entities/user.entity';
import { Category } from './category/entities/category.entity';
import { Resource } from './resource/entities/resource.entity';
import { Product } from './product/entities/product.entity';
import { PaymentMethod } from './payment-method/entities/payment-method.entity';

export const userPaginateConfig: PaginateConfig<User> = {
  defaultLimit: 10,
  defaultSortBy: [['dateEntry', 'DESC']],
  sortableColumns: ['dateEntry'],
  relations: ['userDetail'],
};

export const categoryPaginateConfig: PaginateConfig<Category> = {
  defaultLimit: 10,
  defaultSortBy: [['dateEntry', 'DESC']],
  sortableColumns: ['dateEntry'],
  relations: ['thumbnail'],
};

export const resourcePaginateConfig: PaginateConfig<Resource> = {
  defaultLimit: 10,
  defaultSortBy: [['dateEntry', 'DESC']],
  sortableColumns: ['dateEntry'],
};
export const productPaginateConfig: PaginateConfig<Product> = {
  defaultLimit: 10,
  defaultSortBy: [['dateEntry', 'DESC']],
  sortableColumns: ['dateEntry'],
  relations: ['images', 'category', 'thumbnail'],
};

export const paymentMethodPaginateConfig: PaginateConfig<PaymentMethod> = {
  defaultLimit: 10,
  defaultSortBy: [['dateEntry', 'DESC']],
  sortableColumns: ['dateEntry'],
  filterableColumns: { enabled: [FilterOperator.EQ] },
};
