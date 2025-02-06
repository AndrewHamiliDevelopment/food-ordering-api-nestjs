import { ApiProperty, PartialType } from "@nestjs/swagger";
import { UserCreateDto } from "./user-create.dto";
import { IsNotEmpty, IsString } from "class-validator";

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
    middleName;
}