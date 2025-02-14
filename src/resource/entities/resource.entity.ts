import { BaseEntity } from 'src/Base.entity';

export class Resource extends BaseEntity {
  name: string;
  filename: string;
  enabled: string;

  constructor(resource: Partial<Resource>) {
    super();
    Object.assign(this, resource);
  }
}
