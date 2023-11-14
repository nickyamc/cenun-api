import {Injectable} from '@nestjs/common';
import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({name: 'isVisitorExist', async: true})
@Injectable()
export class IsDniConstraint
    implements ValidatorConstraintInterface {
    async validate(dni: string) {
        const regExp: RegExp = /^[\d]{1,3}\.?[\d]{3,3}\.?[\d]{3,3}$/;
        return regExp.test(dni)
    }

    defaultMessage(args: ValidationArguments) {
        return `El DNI es incorrecto ${args.value}`;
    }
}
