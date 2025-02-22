import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/Base.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { PaymentMethod } from 'src/payment-method/entities/payment-method.entity';
import { Address } from 'src/users/entities/address.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

export enum STATUS {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  IN_TRANSIT = 'IN TRANSIT',
  DELIVERED = 'DELIVERED',
}

@Entity()
export class Order extends BaseEntity {
  @OneToOne(() => Cart, (cart) => cart.id)
  @JoinColumn()
  cart: Cart;

  @Column({ type: 'enum', enum: STATUS, default: STATUS.PENDING })
  status: STATUS;

  @ManyToOne(() => Address, (address) => address.id)
  @ApiProperty()
  address: Address;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.id)
  @JoinColumn()
  paymentMethod: PaymentMethod;

  constructor(order: Partial<Order>) {
    super();
    Object.assign(this, order);
  }
}
