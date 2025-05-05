import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CategoryAddDto } from './category-add.dto';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CategoryUpdateDto extends PartialType(CategoryAddDto) {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  enabled: boolean;
}
