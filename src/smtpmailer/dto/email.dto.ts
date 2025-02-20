import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EmailDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  to: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  subject: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  html: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  text: string;
}
