import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AddressService } from './address.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExtendedRequest } from 'src/shared';
import { AddressAddDto } from './dto/address-add.dto';
import { Address } from './entities/address.entity';

@Controller({ path: 'address', version: '1'})
@ApiBearerAuth('access-token')
@ApiTags('Address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  @ApiResponse({type: Address, isArray: true, description: 'List of address/es created by user'})
  list (@Request() req: ExtendedRequest) {
    return this.addressService.list(req);
  }

  @Post()
  @ApiResponse({type: Address, description: 'Add address'})
  add (@Request() req: ExtendedRequest, @Body() dto: AddressAddDto) {
    return this.addressService.add(req, dto);
  }

}
