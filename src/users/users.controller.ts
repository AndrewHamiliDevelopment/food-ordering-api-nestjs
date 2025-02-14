import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { ExtendedRequest } from 'src/shared';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { userPaginateConfig } from 'src/paginate.config';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserCreateDto } from './dto/user-create.dto';

@Controller({ path: 'users', version: '1' })
@ApiBearerAuth('access-token')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiPaginationQuery(userPaginateConfig)
  list(@Request() req: ExtendedRequest, @Paginate() query: PaginateQuery) {
    return this.usersService.list(query);
  }
  @Post()
  create(@Request() req: ExtendedRequest, @Body() dto: UserCreateDto) {
    return this.usersService.create({ dto });
  }
}
