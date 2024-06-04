import { ApiProperty } from '@nestjs/swagger';
import {
	IsString,
	IsEmail,
	IsPhoneNumber,
	IsNotEmpty,
	Length, MaxLength, MinLength,
	IsOptional,
} from 'class-validator';
import {IsDni} from "../decorator/is-dni.decorator";

export class CreateAccountDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@Length(8,8)
	@IsDni()
	dni: string;

	@ApiProperty({ description: 'Email de la cuenta.', maximum: 100 })
	@IsNotEmpty()
	@IsEmail()
	@MaxLength(100)
	email: string;

	@ApiProperty({
		description: 'Nombre de usuario de la cuenta.',
		minimum: 5,
		maximum: 15,
	})
	@IsNotEmpty()
	@IsString()
	@Length(5, 15)
	username: string;

	@ApiProperty({
		description: 'Contraseña de la cuenta',
		minimum: 8,
	})
	@IsNotEmpty()
	@IsString()
	@MinLength(8)
	password: string;

	@ApiProperty({
		description: 'Nombres de la cuenta',
		minimum: 2,
		maximum: 255,
	})
	@IsNotEmpty()
	@IsString()
	@Length(2, 255)
	firstName: string;

	@ApiProperty({
		description: 'Apellidos de la cuenta',
		minimum: 2,
		maximum: 255,
	})
	@IsNotEmpty()
	@IsString()
	@Length(2, 255)
	lastName: string;

	@ApiProperty({
		description: 'Número de telefono de la cuenta.',
		minimum: 12,
		maximum: 12,
	})
	//@IsNotEmpty()
	@IsOptional()
	@IsPhoneNumber('PE')
	phone: string;
}
