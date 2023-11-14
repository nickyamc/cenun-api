import { IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CreateAttendanceDto {
	@ApiProperty({
		description: 'Visitor id',
		required: true,
		type: Number
	})
	@IsNotEmpty()
	@IsNumber()
	@IsPositive()
	visitorId: number;

	@ApiProperty({
		description: 'Lab id',
		required: true,
		type: Number
	})
	@IsNotEmpty()
	@IsNumber()
	@IsPositive()
	labId: number;

	@ApiProperty({
		description: 'Event id',
		required: true,
		type: Number
	})
	@IsOptional()
	@IsNumber()
	@IsPositive()
	eventId?: number;
}
