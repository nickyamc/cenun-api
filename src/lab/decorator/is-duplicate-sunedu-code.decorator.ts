import { ValidationOptions, registerDecorator } from 'class-validator';
import { IsDuplicateSuneduCodeConstraint } from '../validation/is-duplicate-sunedu-code.validation';

export function IsDuplicateSuneduCode(validationOptions?: ValidationOptions) {
	return function (object: any, propertyName: string) {
		registerDecorator({
			name: 'IsDuplicateSuneduCode',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: IsDuplicateSuneduCodeConstraint,
		});
	};
}
