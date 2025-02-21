import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class OrderCreateDto {
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  cartId: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  addressId: number;
}
