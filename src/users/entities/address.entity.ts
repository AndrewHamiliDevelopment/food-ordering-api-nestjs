import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/Base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Address extends BaseEntity {
  @Column()
  @ApiProperty()
  line1: string;

  @Column()
  @ApiProperty()
  line2: string;

  @Column()
  @ApiProperty()
  cityMunicipality: string;

  @Column()
  @ApiProperty()
  province: string;

  @Column()
  @ApiProperty()
  zipCode: string;

  constructor(address: Partial<Address>) {
    super();
    Object.assign(this, address);
  }
}
