import {ValidationOptions, registerDecorator} from 'class-validator';


export function IsEntityExist(constraint: Function, many: boolean = false, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'IsEntityExist',
            target: object.constructor,
            constraints: [many],
            propertyName: propertyName,
            options: validationOptions,
            validator: constraint,
        });
    };
}