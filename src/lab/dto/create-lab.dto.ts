import { ApiProperty } from '@nestjs/swagger';
import {
	ArrayMinSize,
	IsArray,
	IsInt,
	IsNotEmpty,
	IsString,
	Length,
} from 'class-validator';
import { IsEventExist } from 'src/event/decorator/is-event-exist.decorator';
import { IsDuplicateSuneduCode } from '../decorator/is-duplicate-sunedu-code.decorator';

export class CreateLabDto {
	@ApiProperty({
		description: 'Código sunedu del laboratorio.',
		minLength: 3,
		maxLength: 20,
	})
	@IsNotEmpty()
	@IsString({ message: 'El código sunedu del laboratorio debe ser un texto.' })
	@Length(3, 20, {
		message:
			'El código sunedu del laboratorio debe tener entre 3 y 20 caracteres.',
	})
	@IsDuplicateSuneduCode()
	suneduCode: string;

	@ApiProperty({
		description: 'Ubicación del laboratorio.',
		minLength: 1,
		maxLength: 255,
	})
	@IsNotEmpty()
	@IsString({ message: 'La ubicación del laboratorio debe ser un texto.' })
	@Length(1, 255, {
		message:
			'La ubicación del laboratorio debe tener entre 1 y 255 caracteres.',
	})
	location: string;

	@ApiProperty({
		description:
			'Array de ids de los eventos a los que pertenece el laboratorio.',
		type: [Number],
		required: true,
	})
	@IsNotEmpty()
	@IsArray()
	@IsInt({
		each: true,
		message: 'El id del evento debe ser un número.',
	})
	@ArrayMinSize(1, {
		message: 'El laboratorio debe pertenecer a al menos un evento.',
	})
	@IsEventExist()
	eventIds: number[];
}
