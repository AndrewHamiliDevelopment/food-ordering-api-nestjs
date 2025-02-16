import { Controller, Get, Param } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller({ path: 'resource' })
@ApiTags('Resource')
export class ResourcePublicController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get('file/:id')
  @ApiOperation({
    summary: 'Get Resource material with authentication bypassed',
  })
  file(@Param('id') id: number) {
    return this.resourceService.outFile({ id });
  }
}
