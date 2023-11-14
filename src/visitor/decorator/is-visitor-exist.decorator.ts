import {ValidationOptions, registerDecorator} from 'class-validator';
import {IsVisitorExistConstraints} from '../validation/is-visitor-exist.validation';

export function IsVisitorExist(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string): void {
        registerDecorator({
            name: 'IsVisitorExist',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsVisitorExistConstraints,
        });
    };
}
