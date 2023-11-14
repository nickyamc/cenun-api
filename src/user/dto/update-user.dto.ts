import {
	IsOptional,
	IsDefined,
	IsNotEmptyObject,
	ValidateNested,
} from 'class-validator';
import { UpdateAccountDto } from 'src/entities/dto/update-account.dto';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), [
	'account',
] as const) {
	@ApiProperty({ type: UpdateAccountDto, required: false })
	@IsOptional()
	@IsDefined()
	@IsNotEmptyObject()
	@ValidateNested()
	@Type(() => UpdateAccountDto)
	account?: UpdateAccountDto;
}
