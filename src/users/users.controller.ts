import { Controller, Get, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { ExtendedRequest } from 'src/shared';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { userPaginateConfig } from 'src/paginate.config';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiPaginationQuery(userPaginateConfig)
  list (@Request() req: ExtendedRequest, @Paginate() query: PaginateQuery) {
    return this.usersService.list(query);
  }

}
