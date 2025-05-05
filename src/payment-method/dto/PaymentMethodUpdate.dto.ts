import { IsBoolean, IsNotEmpty } from 'class-validator';
import { PaymentMethodAddDto } from './PaymentMethodAdd.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentMethodUpdateDto extends PaymentMethodAddDto {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  enabled: boolean;

  constructor(pmu: Partial<PaymentMethodUpdateDto>) {
    super();
    Object.assign(this, pmu);
  }
}
