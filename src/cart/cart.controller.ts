import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { ExtendedRequest } from 'src/shared';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartAddProductDto } from './dto/cart-add-product.dto';
import { Cart } from './entities/cart.entity';

@Controller({ path: 'cart', version: '1' })
@ApiBearerAuth('access-token')
@ApiTags('Cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req: ExtendedRequest) {
    return this.cartService.get(req);
  }
  @Post()
  @ApiResponse({ type: Cart })
  addToCart(@Request() req: ExtendedRequest, @Body() dto: CartAddProductDto) {
    return this.cartService.addToCart({ req, dto });
  }
  @Delete(':id')
  @ApiResponse({ type: Cart })
  deleteFromCart(@Param('id') id: number, @Request() req: ExtendedRequest) {
    const dto: CartAddProductDto = { productId: id };
    return this.cartService.removeToCart({ req, dto });
  }
}
