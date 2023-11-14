import {ValidationOptions, registerDecorator} from 'class-validator';
import {IsUserExistConstraint} from "../validation/is-user-exist.validation";
import {isUndefined} from "@nestjs/common/utils/shared.utils";

export function IsUserExist(many?: boolean, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'IsUserExist',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [isUndefined(many) ? false : many],
            validator: IsUserExistConstraint,
        });
    };
}