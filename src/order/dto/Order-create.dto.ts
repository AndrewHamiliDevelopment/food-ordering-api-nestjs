import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { PAYMENT_METHOD } from '../entities/order.entity';

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

  @IsEnum(PAYMENT_METHOD)
  @ApiProperty({enum: PAYMENT_METHOD, default: PAYMENT_METHOD.CASH})
  paymentMethod: PAYMENT_METHOD;

}
