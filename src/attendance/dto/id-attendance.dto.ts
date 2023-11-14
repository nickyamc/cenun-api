import {IsAttendanceExist} from "../decorator/is-attendance-exist.decorator";
import {IsInt, IsNotEmpty, IsPositive} from "class-validator";
import {Transform, Type} from "class-transformer";

export class IdAttendanceDto{
    @IsNotEmpty()
    @Type(() => Number)
    @Transform(({value}) => Number(value))
    @IsInt()
    @IsPositive()
    @IsAttendanceExist()
    id: number;
}