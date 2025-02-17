import { Controller, Get, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { ExtendedRequest } from 'src/shared';

@Controller({ path: 'cart', version: '1' })
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req: ExtendedRequest) {
    return this.cartService.get(req);
  }
}
