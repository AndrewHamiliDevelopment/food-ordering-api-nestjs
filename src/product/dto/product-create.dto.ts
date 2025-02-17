import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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
