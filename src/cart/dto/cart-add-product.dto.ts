import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CartAddProductDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  productId: number;
}
