import {Injectable} from '@nestjs/common';
import {
    isArray,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import {LabService} from '../lab.service';

@ValidatorConstraint({name: 'isLabExist', async: true})
@Injectable()
export class IsLabExistConstraint
    implements ValidatorConstraintInterface {
    constructor(private readonly labService: LabService) {
    }

    async validate(value: number | number[]) {
        try {
            if (isArray<number>(value)) await this.labService.findAllOrFail(value)
            else await this.labService.findOneOrFail(value);
            return true;
        } catch (error) {
            return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        return `El Laboratorio con id ${args.value} no existe.`;
    }
}
