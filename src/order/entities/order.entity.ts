import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/Base.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { PaymentMethod } from 'src/payment-method/entities/payment-method.entity';
import { Address } from 'src/address/entities/address.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

export enum STATUS {
  UNPAID = 'UNPAID',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PROCESSED = 'PROCESSED',
  IN_TRANSIT = 'IN TRANSIT',
  DELIVERED = 'DELIVERED',
}

@Entity()
export class Order extends BaseEntity {
  @OneToOne(() => Cart, (cart) => cart.id, {nullable: false})
  @JoinColumn()
  @ApiProperty()
  cart: Cart;

  @Column({ type: 'enum', enum: STATUS, default: STATUS.PENDING, nullable: false})
  @ApiProperty({enum: STATUS, default: STATUS.UNPAID})
  status: STATUS;

  @ManyToOne(() => Address, (address) => address.id, {nullable: false})
  @ApiProperty()
  address: Address;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.id, {nullable: false})
  @JoinColumn()
  @ApiProperty()
  paymentMethod: PaymentMethod;

  constructor(order: Partial<Order>) {
    super();
    Object.assign(this, order);
  }
}
