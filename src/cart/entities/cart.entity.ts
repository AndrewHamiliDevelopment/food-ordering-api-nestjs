import { BaseEntity } from 'src/Base.entity';
import { Address } from 'src/users/entities/address.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CartItem } from './cart-item.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Cart extends BaseEntity {
  @Column({ type: 'varbinary', length: 36 })
  @Generated('uuid')
  @ApiProperty()
  uuid: string;
  @ManyToOne(() => Address, (address) => address.id)
  @ApiProperty()
  address: Address;
  @ManyToOne(() => User, (user) => user.id)
  @ApiProperty()
  user: User;
  @Column({ default: false })
  @ApiProperty()
  isCheckedOut: boolean;
  @CreateDateColumn({ nullable: true })
  @ApiProperty()
  dateCheckedOut: Date;
  @DeleteDateColumn()
  @ApiProperty()
  dateDeleted: Date;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  @JoinColumn()
  @ApiProperty({ isArray: true, type: () => CartItem })
  cartItems: CartItem[];
}
