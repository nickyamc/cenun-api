import {IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength} from "class-validator";
import {Transform} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";

export class LoginAuthDto {
    @ApiProperty({type: String, required: false})
    @IsOptional()
    @Transform(({value}) => value.trim())
    @IsEmail()
    @MaxLength(100)
    email?: string;

    @ApiProperty({type: String, required: false})
    @IsOptional()
    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(5)
    @MaxLength(15)
    username?: string;

    @ApiProperty({type: String, required: true})
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    @MinLength(8)
    password: string;
}