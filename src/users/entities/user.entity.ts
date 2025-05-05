import { BaseEntity } from 'src/Base.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { UserDetail } from './user-detail.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Address } from 'src/address/entities/address.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  @ApiProperty()
  uid: string;
  
  @Column({ nullable: true })
  @ApiProperty()
  displayName: string;
  
  @Column()
  @ApiProperty()
  email: string;


  @Column()
  @ApiProperty()
  emailVerified: boolean;

  
  @Column({ nullable: true })
  @ApiProperty()
  phoneNumber: string;


  @Column({ nullable: true })
  @ApiProperty()
  photoURL: string;

  
  @Column()
  @ApiProperty()
  disabled: boolean;

  @OneToOne(() => UserDetail, (userDetail) => userDetail.user)
  @ApiProperty()
  userDetail: UserDetail;

  @OneToMany(() => Address, (address) => address.user)
  @ApiProperty({isArray: true, type: Address })
  address: Address[];

  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }
}
