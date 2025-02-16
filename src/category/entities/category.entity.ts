import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/Base.entity';
import { Resource } from 'src/resource/entities/resource.entity';
import {
  Tree,
  Column,
  Entity,
  ManyToOne,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity()
@Tree('nested-set')
export class Category extends BaseEntity {
  @Column({ nullable: false })
  @ApiProperty()
  name: string;
  @Column({ nullable: false })
  @ApiProperty()
  description: string;
  @ManyToOne(() => Resource, (resource) => resource.id, { cascade: true })
  @ApiProperty()
  thumbnail: Resource;
  @Column({ default: true })
  @ApiProperty()
  enabled: boolean;

  @TreeChildren()
  children: Category[];
  @TreeParent()
  parent: Category;

  constructor(category: Partial<Category>) {
    super();
    Object.assign(this, category);
  }
}
