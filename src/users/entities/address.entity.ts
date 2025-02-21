import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/Base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Address extends BaseEntity {

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;

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

  @Column()
  @ApiProperty()
  recipientName: string;

  constructor(address: Partial<Address>) {
    super();
    Object.assign(this, address);
  }
}
