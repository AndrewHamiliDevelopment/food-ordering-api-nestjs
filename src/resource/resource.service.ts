import {
  Injectable,
  Logger,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Resource } from './entities/resource.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { resourcePaginateConfig } from 'src/paginate.config';
import { createReadStream } from 'fs';
import { ConfigService } from '@nestjs/config';
import { join, sep, resolve } from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs/promises';

@Injectable()
export class ResourceService {
  private logger = new Logger(ResourceService.name);
  private uploadPath = '';
  constructor(
    @InjectRepository(Resource)
    private readonly repository: Repository<Resource>,
    private readonly configService: ConfigService,
  ) {
    this.uploadPath = this.configService.getOrThrow<string>(
      'RESOURCE_UPLOAD_PATH',
    );
  }

  list = (query: PaginateQuery) => {
    this.logger.log('list', query);
    return paginate(query, this.repository, resourcePaginateConfig);
  };

  create = async (file: Express.Multer.File) => {
    const { filename: fn, mimetype } = file;
    this.logger.log('upload file', { fn, mimetype });
    const filename = `${fn}`;
    return await this.repository.save({ filename, mimetype });
  };

  findOne = async (id: number) => {
    const resource = this.repository.findOne({ where: { id } });
    return resource !== null && resource;
    throw new NotFoundException('File not found');
  };

  outFile = async (props: { id: number }) => {
    const { id } = props;
    const resource = await this.repository.findOne({
      where: { id, enabled: true },
    });
    this.logger.log('🚀 ~ ResourceService ~ outFile= ~ resource:', resource);
    if (resource !== null) {
      const { filename, mimetype: type } = resource;
      const filePath = join(this.uploadPath, filename);
      this.logger.log('🚀 ~ ResourceService ~ outFile= ~ filePath:', {
        filePath,
      });
      try {
        try {
          await fs.readFile(filePath);
          const file = await createReadStream(filePath);
          const streamableFile = new StreamableFile(file, {
            type,
            disposition: `attachment; filename="${filename}.${type.split('/')[1]}"`,
          });
          return streamableFile;
        } catch (error) {
          console.error(error);
        }
      } catch (error) {
        console.log('error', error);
        this.logger.error(error);
      }
    }
    throw new NotFoundException(
      'File not found either because it does not exist or it was already disabled.',
    );
  };
}
