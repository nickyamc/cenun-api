import { ValidationOptions, registerDecorator } from 'class-validator';
import {NotExistSessionByUserIdValidatorConstraint} from "../validator/not-exist-session-by-user-id.validator";

export function NotExistSessionByUserId(validationOptions?: ValidationOptions) {
	return function (object: any, propertyName: string) {
		registerDecorator({
			name: 'NotExistSessionByUserId',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: NotExistSessionByUserIdValidatorConstraint,
		});
	};
}
