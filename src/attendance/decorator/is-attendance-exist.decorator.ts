import {ValidationOptions, registerDecorator} from 'class-validator';
import {IsAttendanceExistConstraint} from '../validation/is-attendance-exist.validation';

export function IsAttendanceExist(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string): void {
        registerDecorator({
            name: 'IsAttendanceExist',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsAttendanceExistConstraint,
        });
    };
}
