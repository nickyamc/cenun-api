import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class RelationsEventDto {
	@IsOptional()
	@IsBoolean()
	@Type(() => Boolean)
	@Transform(({ value }) => Boolean(value))
	labs?: boolean;

	@IsOptional()
	@IsBoolean()
	@Type(() => Boolean)
	@Transform(({ value }) => Boolean(value))
	visitors?: boolean;

	@IsOptional()
	@IsBoolean()
	@Type(() => Boolean)
	@Transform(({ value }) => Boolean(value))
	attendances?: boolean;
}
