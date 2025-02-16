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
  urls: { info: string; file: string };

  @AfterLoad()
  generateURL() {
    console.log('==========');
    this.urls = {
      info: `${process.env.APP_BASE_URL}/v1/resource/${this.id}`,
      file: `${process.env.APP_BASE_URL}/v1/resource/file/${this.id}`,
    };
  }

  constructor(resource: Partial<Resource>) {
    super();
    Object.assign(this, resource);
  }
}
