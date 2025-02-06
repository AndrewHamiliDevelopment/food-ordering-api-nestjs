import { Controller, Get, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { ExtendedRequest } from 'src/shared';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  list (@Request() req: ExtendedRequest, @Paginate() query: PaginateQuery) {
    return this.usersService.list(query);
  }

}
