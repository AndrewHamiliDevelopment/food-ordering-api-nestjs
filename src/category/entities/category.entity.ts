import { BaseEntity } from 'src/Base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Category extends BaseEntity {
  @Column({ nullable: false })
  name: string;
  @Column({ nullable: false })
  description: string;
  @Column({ default: true })
  enabled: boolean;

  constructor(category: Partial<Category>) {
    super();
    Object.assign(this, category);
  }
}
