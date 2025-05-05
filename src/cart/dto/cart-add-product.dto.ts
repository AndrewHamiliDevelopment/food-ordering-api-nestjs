import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CartAddProductDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  productId: number;

}
