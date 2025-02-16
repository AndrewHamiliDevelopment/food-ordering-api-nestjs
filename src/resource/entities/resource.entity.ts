import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/Base.entity';
import { AfterInsert, AfterLoad, Column, Entity } from 'typeorm';

@Entity()
export class Resource extends BaseEntity {
  @Column({ nullable: false })
  @ApiProperty()
  filename: string;
  @Column({ nullable: false })
  @ApiProperty()
  mimetype: string;
  @Column({ default: true })
  @ApiProperty()
  enabled: boolean;
  url: string;

  @AfterLoad()
  generateURL() {
    console.log('==========');
    this.url = `${process.env.RESOURCE_UPLOAD_PATH}/${this.filename}`;
  }

  constructor(resource: Partial<Resource>) {
    super();
    Object.assign(this, resource);
  }
}
