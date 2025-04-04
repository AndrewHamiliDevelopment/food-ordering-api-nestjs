import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/Base.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { PaymentMethod } from 'src/payment-method/entities/payment-method.entity';
import { Address } from 'src/address/entities/address.entity';
import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Payment } from 'src/payment/entities/payment.entity';

export enum STATUS {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  PROCESSING = 'PROCESSING',
  PROCESSED = 'PROCESSED',
  IN_TRANSIT = 'IN TRANSIT',
  DELIVERED = 'DELIVERED',
}

export enum PAYMENT_METHOD {
  CASH = 'cash',
  PAYPAL = 'paypal',
}

@Entity()
export class Order extends BaseEntity {
  @Column({ type: 'varbinary', length: 36 })
  @Generated('uuid')
  @ApiProperty()
  uuid: string;
  
  @OneToOne(() => Cart, (cart) => cart.id, { nullable: false })
  @JoinColumn()
  @ApiProperty()
  cart: Cart;

  @Column({ type: 'enum', enum: STATUS, default: STATUS.UNPAID, nullable: false })
  @ApiProperty({ enum: STATUS, default: STATUS.UNPAID })
  status: STATUS;

  @ManyToOne(() => Address, (address) => address.id, { nullable: false })
  @ApiProperty()
  address: Address;

  @Column({ type: 'enum', enum: PAYMENT_METHOD, default: PAYMENT_METHOD.CASH })
  paymentMethod: PAYMENT_METHOD;

  @OneToOne(() => Payment, (payment) => payment.order)
  payment: Payment;

  constructor(order: Partial<Order>) {
    super();
    Object.assign(this, order);
  }
}
