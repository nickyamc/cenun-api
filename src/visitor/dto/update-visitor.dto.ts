import {
	IsOptional,
	IsDefined,
	IsNotEmptyObject,
	ValidateNested,
} from 'class-validator';
import { UpdateAccountDto } from 'src/entities/dto/update-account.dto';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateVisitorDto } from './create-visitor.dto';
import { Type } from 'class-transformer';

export class UpdateVisitorDto extends OmitType(
	PartialType(CreateVisitorDto),
	['account'] as const,
) {
	@ApiProperty({ type: UpdateAccountDto, required: false })
	@IsOptional()
	@IsDefined()
	@IsNotEmptyObject()
	@ValidateNested()
	@Type(() => UpdateAccountDto)
	account?: UpdateAccountDto;
}
