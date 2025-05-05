import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UserCreateDto } from './user-create.dto';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/shared';

export class UserUpdateDto extends PartialType(UserCreateDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  middleName: string;

  @ApiProperty({ enum: Role, default: Role.SUPERADMIN })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
