import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class ProductCreateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty()
  price: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  categoryId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  thumbnailId: number;

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  @ApiProperty({ isArray: true, type: Number })
  imageIds: number[];
}
