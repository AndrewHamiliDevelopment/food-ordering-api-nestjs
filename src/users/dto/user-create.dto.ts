import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Role } from 'src/shared';

export class UserCreateDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
  @IsBoolean()
  @ApiProperty()
  emailVerified: boolean;
  @IsBoolean()
  @ApiProperty()
  notifyAccountCreation: boolean;
  @IsEnum(Role)
  @IsOptional()
  @ApiProperty({ enum: Role, enumName: 'Role', default: Role.SUPERADMIN })
  role: Role;
}
