import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { ProductSnapshot } from 'src/product/entities/product-snapshot.entity';
import { BaseEntity } from 'src/Base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class CartItem extends BaseEntity {
  @ManyToOne(() => Cart, (cart) => cart.id, { cascade: true, nullable: false })
  @ApiProperty({ type: () => Cart })
  cart: Cart;
  @OneToOne(() => ProductSnapshot, (productSnapshot) => productSnapshot.id, {
    cascade: true,
  })
  @JoinColumn()
  @ApiProperty()
  product: ProductSnapshot;
  @Column()
  @ApiProperty()
  quantity: number;

  constructor(cartItem: Partial<CartItem>) {
    super();
    Object.assign(this, cartItem);
  }
}
