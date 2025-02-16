import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ResourceService } from './resource.service';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { resourcePaginateConfig } from 'src/paginate.config';
import { Resource } from './entities/resource.entity';

@Controller({ path: 'resource', version: '1' })
@ApiBearerAuth('access-token')
@ApiTags('Resource')
export class ResourceController {
  private logger = new Logger(ResourceController.name);
  constructor(private readonly resourceService: ResourceService) {}

  @Get()
  @ApiPaginationQuery(resourcePaginateConfig)
  @ApiOkPaginatedResponse(Resource, resourcePaginateConfig)
  list(@Paginate() query: PaginateQuery) {
    this.logger.log('list', query);
    return this.resourceService.list(query);
  }
  @Get(':id')
  getOne(@Param('id') id: number) {
    this.logger.log('get by ID', { id });
    return this.resourceService.findOne(id);
  }
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({ summary: 'Upload resource file' })
  create(@UploadedFile('file') file: Express.Multer.File) {
    return this.resourceService.create(file);
  }
  @Get('file/:id')
  getFile(@Param('id') id: number) {
    this.logger.log('get file', { id });
    return this.resourceService.outFile({ id });
  }
}
