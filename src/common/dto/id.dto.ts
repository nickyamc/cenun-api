import {IsInt, IsNotEmpty, IsPositive, Validate} from "class-validator";
import {Transform, Type} from "class-transformer";
import {ParseIntPipe} from "@nestjs/common";

export class IdDto {
    @IsNotEmpty()
    @Type(() => Number)
    @Transform(({value}) => Number(value))
    @IsInt()
    @IsPositive()
    id: number;
}