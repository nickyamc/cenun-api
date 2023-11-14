import { Injectable } from '@nestjs/common';
import {
    isArray,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import {SessionService} from "../session.service";

@ValidatorConstraint({ name: 'IsSessionExist', async: true })
@Injectable()
export class IsSessionExistValidatorConstraint
    implements ValidatorConstraintInterface
{
    constructor(private readonly sessionService: SessionService) {}
    async validate(value: number | number[]) {
        try {
            if (isArray<number>(value)) await this.sessionService.findAllOrFail(value)
            else await this.sessionService.findOneOrFail(value);
            return true;
        } catch (error) {
            return false;
        }
    }
    defaultMessage(args: ValidationArguments) {
        return `La Sessión no existe ${args.value}.`;
    }
}
