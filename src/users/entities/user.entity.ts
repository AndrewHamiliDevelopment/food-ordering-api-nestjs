import { BaseEntity } from 'src/Base.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { UserDetail } from './user-detail.entity';
import { ApiProperty } from '@nestjs/swagger';

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

  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }
}
