import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export class CategoryAddDto {
  @IsNumber()
  @IsOptional()
  @ValidateIf((v) => v.categoryId > 1)
  @ApiProperty()
  categoryId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty()
  @ValidateIf((v) => v.thumbnailId !== null)
  thumbnailId: number;
}
