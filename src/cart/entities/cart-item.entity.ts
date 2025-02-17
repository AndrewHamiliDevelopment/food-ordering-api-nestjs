import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { ProductSnapshot } from 'src/product/entities/product-snapshot.entity';
import { BaseEntity } from 'src/Base.entity';

@Entity()
export class CartItem extends BaseEntity {
  @ManyToOne(() => Cart, (cart) => cart.id)
  cart: Cart;
  @OneToOne(() => ProductSnapshot, (productSnapshot) => productSnapshot.id, {
    cascade: true,
  })
  product: ProductSnapshot;
  @Column()
  quantity: number;
}
