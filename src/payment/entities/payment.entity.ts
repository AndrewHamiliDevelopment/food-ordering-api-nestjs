import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/Base.entity";
import { Order } from "src/order/entities/order.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity()
export class Payment extends BaseEntity{
    @OneToOne(() => Order, (order) => order.payment, {cascade: true})
    @JoinColumn()
    order: Order;

    @Column({type: 'json'})
    @ApiProperty()
    paymentMethodProps: object;

    constructor(payment: Partial<Payment>) {
        super();
        Object.assign(this, payment);
    }

}