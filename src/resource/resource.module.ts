import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from './entities/resource.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resource]),
    MulterModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        dest: configService.getOrThrow<string>('RESOURCE_UPLOAD_PATH'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ResourceController],
  providers: [ResourceService],
})
export class ResourceModule {}
