import {Injectable} from '@nestjs/common';
import {
    isArray,
    isNumber,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import {AttendanceService} from "../attendance.service";

@ValidatorConstraint({name: 'isAttendanceExist', async: true})
@Injectable()
export class IsAttendanceExistConstraint
    implements ValidatorConstraintInterface {
    constructor(private readonly attendanceService: AttendanceService) {
    }

    async validate(value: string | number | number[]) {
        try {
            if (isArray<number>(value)) await this.attendanceService.findAllOrFail(value);
            else await this.attendanceService.findOneByIdOrCheckCodeOrFail(value);
            return true;
        } catch (error) {
            return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        return `La Asistencia con id ${args.value} no existe.`;
    }
}
