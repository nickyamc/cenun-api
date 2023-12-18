import { Injectable } from '@nestjs/common';
import {
    isArray,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import {SessionService} from "../session.service";

@ValidatorConstraint({ name: 'NotExistSessionByUserId', async: true })
@Injectable()
export class NotExistSessionByUserIdValidatorConstraint
    implements ValidatorConstraintInterface
{
    constructor(private readonly sessionService: SessionService) {}
    async validate(value: number) {
        try {
            await this.sessionService.notExistByUserIdOrFail(value);
            return true;
        } catch (error) {
            return false;
        }
    }
    defaultMessage(args: ValidationArguments) {
        return `Ya se creo una sesión este día, id del usuario: ${args.value}.`;
    }
}