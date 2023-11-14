import {IsDate, IsOptional} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
import {Transform, Type} from "class-transformer";

export class DatesAttendanceDto {
    @ApiProperty({type: Date, required: false})
    @IsOptional()
    @Type(() => Date)
    @Transform(({value}) => new Date(value))
    @IsDate()
    startDate?: Date;

    @ApiProperty({type: Date, required: false})
    @IsOptional()
    @Type(() => Date)
    @Transform(({value}) => new Date(value))
    @IsDate()
    endDate?: Date;
}
