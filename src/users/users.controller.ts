import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ExtendedRequest } from 'src/shared';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { userPaginateConfig } from 'src/paginate.config';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './dto/User-update.dto';

@Controller({ path: 'users', version: '1' })
@ApiBearerAuth('access-token')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiPaginationQuery(userPaginateConfig)
  list(@Request() req: ExtendedRequest, @Paginate() query: PaginateQuery) {
    return this.usersService.list(req, query);
  }
  @Get('me')
  me(@Request() req: ExtendedRequest) {
    return this.usersService.me(req);
  }
  @Post()
  create(@Request() req: ExtendedRequest, @Body() dto: UserCreateDto) {
    return this.usersService.create({ req, dto });
  }
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Request() req: ExtendedRequest,
    @Body() dto: UserUpdateDto,
  ) {
    console.log('id', id);
    return this.usersService.update({ req, userId: id, dto });
  }
}
