import {ValidationOptions, registerDecorator} from 'class-validator';
import {IsEventExistConstraint} from "../validation/is-event-exist.validation";

export function IsEventExist(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'IsEventExist',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsEventExistConstraint,
        });
    };
}
