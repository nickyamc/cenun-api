import { Injectable } from '@nestjs/common';
import {
	isArray,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';
import { EventService } from '../event.service';

@ValidatorConstraint({ name: 'IsEventExist', async: true })
@Injectable()
export class IsEventExistConstraint implements ValidatorConstraintInterface {
	constructor(private readonly eventService: EventService) {}
	async validate(value: number | number[]) {
		try {
			if (isArray<number>(value)) await this.eventService.findAllOrFail(value);
			else await this.eventService.findOneOrFail(value);
			return true;
		} catch (error) {
			return false;
		}
	}
	defaultMessage(args: ValidationArguments) {
		return `El Evento con id ${args.value} no existe.`;
	}
}
