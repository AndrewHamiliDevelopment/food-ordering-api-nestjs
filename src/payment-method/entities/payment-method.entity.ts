import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/Base.entity';
import { Column } from 'typeorm';

export class PaymentMethod extends BaseEntity {
  @Column({ nullable: false })
  @ApiProperty()
  name: string;

  @Column({ nullable: false })
  @ApiProperty()
  description: string;

  @Column({ type: 'text' })
  @ApiProperty()
  additionalNotes: string;

  @Column()
  @ApiProperty()
  enabled: boolean;

  constructor(paymentMethod: Partial<PaymentMethod>) {
    super();
    Object.assign(this, paymentMethod);
  }
}
