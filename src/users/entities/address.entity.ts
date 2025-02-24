import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/Base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { UserDetail } from './user-detail.entity';

@Entity()
export class Address extends BaseEntity {

  @ManyToOne(() => UserDetail, (userDetail) => userDetail.address, {cascade: true})
  @JoinColumn()
  userDetail: UserDetail;

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

  @Column()
  @ApiProperty()
  contactNumber: string;

  constructor(address: Partial<Address>) {
    super();
    Object.assign(this, address);
  }
}
