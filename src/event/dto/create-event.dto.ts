import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateEventDto {
	@ApiProperty({
		minLength: 2,
		maxLength: 255,
		example: 'Evento de prueba',
		description: 'Titulo del evento',
	})
	@IsNotEmpty()
	@IsString()
	@Length(2, 255)
	title: string;

	@ApiProperty({
		minLength: 5,
		example: 'Descripcion de prueba',
		description: 'Descripcion del evento',
		required: false,
	})
	@IsOptional()
	@IsString()
	@Length(5)
	description?: string;

	@ApiProperty({
		minLength: 2,
		maxLength: 255,
		example: 'Ciudad Universitaria - UNAMAD',
		description: 'Lugar del evento',
	})
	@IsNotEmpty()
	@IsString()
	@Length(2, 255)
	location: string;
}
