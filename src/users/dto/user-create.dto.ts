import { ApiProperty } from "@nestjs/swagger";
import { IsBooleanString, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserCreateDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsBooleanString()
    emailVerified: boolean;
    @IsBooleanString()
    notifyAccountCreation: boolean;
}