import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class OrderCreateDto {
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty()
  cartId: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty()
  addressId: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty()
  paymentMethodId: number;

}
