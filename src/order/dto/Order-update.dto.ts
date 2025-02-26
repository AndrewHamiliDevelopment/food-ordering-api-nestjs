import { ApiProperty } from '@nestjs/swagger';
import { STATUS } from '../entities/order.entity';
import { IsEnum } from 'class-validator';

export class OrderUpdateDto {
  @ApiProperty({enum: STATUS, default: STATUS.PENDING})
  @IsEnum(STATUS)
  status: STATUS;
}
