import { BaseEntity } from 'src/Base.entity';
import { Product } from './product.entity';
import { Category } from 'src/category/entities/category.entity';
import { Resource } from 'src/resource/entities/resource.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ProductSnapshot extends BaseEntity {
  @ManyToOne(() => Product, (product) => product.id, { cascade: true })
  @JoinColumn()
  @ApiProperty()
  product: Product;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  description: string;

  @Column({ type: 'decimal', precision: 18, scale: 4 })
  @ApiProperty()
  price: number;

  @ManyToOne(() => Category, (category) => category.id)
  @JoinColumn()
  @ApiProperty()
  category: Category;

  @ManyToOne(() => Resource, (resource) => resource.id)
  @JoinColumn()
  @ApiProperty()
  thumbnail: Resource;

  @Column()
  @ApiProperty()
  enabled: boolean;

  constructor(productSnapshot: Partial<ProductSnapshot>) {
    super();
    Object.assign(this, productSnapshot);
  }
}
