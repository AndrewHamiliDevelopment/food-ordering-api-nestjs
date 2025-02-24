import { BaseEntity } from 'src/Base.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Address } from './address.entity';

@Entity()
export class UserDetail extends BaseEntity {
  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;

  @Column()
  @ApiProperty()
  lastName: string;

  @Column()
  @ApiProperty()
  firstName: string;
  @Column()
  @ApiProperty()
  middleName: string;

  @OneToMany(() => Address, (address) => address.userDetail)
  address: Address[];

  constructor(userDetail: Partial<UserDetail>) {
    super();
    Object.assign(this, userDetail);
  }
}
