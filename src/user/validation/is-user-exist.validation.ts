import {Injectable} from '@nestjs/common';
import {
    isArray,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import {UserService} from '../user.service';

@ValidatorConstraint({name: 'isUserExist', async: true})
@Injectable()
export class IsUserExistConstraint implements ValidatorConstraintInterface {
    constructor(private readonly userService: UserService) {
    }

    async validate(value: number | number[]) {
        try {
            if (isArray<number>(value)) await this.userService.findAllOrFail(value)
            else await this.userService.findOneOrFail(value);
            return true;
        } catch (error) {
            return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        return `El Usuario ${args.value} no existen.`;
    }
}