import {ValidationOptions, registerDecorator} from 'class-validator';
import {IsDniConstraint} from "../validation/is-dni.validate";

export function IsDni(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string): void {
        registerDecorator({
            name: 'IsVisitorExist',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsDniConstraint,
        });
    };
}
