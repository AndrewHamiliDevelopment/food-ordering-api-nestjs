import { ApiProperty } from '@nestjs/swagger';
import { resolve } from 'path';
import { BaseEntity } from 'src/Base.entity';
import { Category } from 'src/category/entities/category.entity';
import { Resource } from 'src/resource/entities/resource.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @Column({ nullable: false })
  @ApiProperty()
  name: string;

  @Column({ nullable: true })
  @ApiProperty()
  description: string;

  @ManyToOne(() => Category, (category) => category.id, { cascade: true })
  @JoinColumn()
  @ApiProperty()
  category: Category;

  @ManyToOne(() => Resource, (resource) => resource.id, { cascade: true })
  @JoinColumn()
  @ApiProperty()
  thumbnail: Resource;

  @ManyToMany(() => Resource)
  @JoinTable()
  @ApiProperty({ isArray: true, type: Resource })
  images: Resource[];

  @Column({ default: true })
  @ApiProperty()
  enabled: boolean;

  constructor(product: Partial<Product>) {
    super();
    Object.assign(this, product);
  }
}
