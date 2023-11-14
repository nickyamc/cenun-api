import {Injectable} from '@nestjs/common';
import {
    isArray,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import {VisitorService} from '../visitor.service';

@ValidatorConstraint({name: 'isVisitorExist', async: true})
@Injectable()
export class IsVisitorExistConstraints
    implements ValidatorConstraintInterface {
    constructor(private readonly visitorService: VisitorService) {
    }

    async validate(value: number | number[]) {
        try {
            if (isArray<number>(value)) await this.visitorService.findAllOrFail(value)
            else await this.visitorService.findOneOrFail(value);
            return true;
        } catch (error) {
            return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        return `El Visitante con id ${args.value} no existe.`;
    }
}
