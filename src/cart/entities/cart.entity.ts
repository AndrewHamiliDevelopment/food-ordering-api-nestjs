import { BaseEntity } from 'src/Base.entity';
import { Address } from 'src/users/entities/address.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Cart extends BaseEntity {
  @Column({ type: 'uuid' })
  uuid: string;
  @ManyToOne(() => Address, (address) => address.id)
  address: Address;
  @ManyToOne(() => User, (user) => user.id)
  user: User;
  @Column({ default: false })
  isCheckedOut: boolean;
  @CreateDateColumn({ nullable: true })
  dateCheckedOut: Date;
  @DeleteDateColumn()
  dateDeleted: Date;
}
