import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class RelationsVisitorDto {
	@IsOptional()
	@IsBoolean()
	@Type(() => Boolean)
	@Transform(({ value }) => Boolean(value))
	events?: boolean;

	@IsOptional()
	@IsBoolean()
	@Type(() => Boolean)
	@Transform(({ value }) => Boolean(value))
	attendances?: boolean;
}
