import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateIf } from "class-validator";
import { has } from "lodash";

export class AddressAddDto {

    @IsNumber()
    @Min(1)
    @ValidateIf((o, v) => {
        console.log({o, v})
        return !has('userId', o);
    })
    @ApiProperty({required: false})
    userId: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    line1: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    line2: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    cityMunicipality: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    province: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    zipCode: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    contactNumber: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    recipientName: string;
}