import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { UserDetail } from 'src/users/entities/user-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, User, UserDetail]), UsersModule],
  controllers: [AddressController],
  providers: [AddressService, UsersService],
})
export class AddressModule {}
