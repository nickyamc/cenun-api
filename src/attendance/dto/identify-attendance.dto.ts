import {IsAttendanceExist} from "../decorator/is-attendance-exist.decorator";
import {IsNotEmpty, IsString} from "class-validator";

export class IdentifyAttendanceDto {
    @IsNotEmpty()
    @IsString()
    @IsAttendanceExist()
    identify: string;
}