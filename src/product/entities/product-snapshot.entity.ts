import { BaseEntity } from 'src/Base.entity';
import { Product } from './product.entity';
import { Category } from 'src/category/entities/category.entity';
import { Resource } from 'src/resource/entities/resource.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class ProductSnapshot extends BaseEntity {
  @ManyToOne(() => Product, (product) => product.id, { cascade: true })
  @JoinColumn()
  product: Product;
  @Column()
  name: string;
  @Column()
  description: string;
  @ManyToOne(() => Category, (category) => category.id)
  category: Category;

  @ManyToOne(() => Resource, (resource) => resource.id)
  thumbnail: Resource;
  @Column()
  enabled: boolean;

  constructor(productSnapshot: Partial<ProductSnapshot>) {
    super();
    Object.assign(this, productSnapshot);
  }
}
