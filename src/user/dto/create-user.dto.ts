import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsEnum,
    IsDate,
    IsInt,
    IsPositive,
    Length,
    IsDefined,
    IsNotEmptyObject,
    ValidateNested,
} from 'class-validator';
import {CreateAccountDto} from 'src/entities/dto/create-account.dto';
import {UserRole} from '../enums';
import {Transform, Type} from 'class-transformer';
import {ApiProperty} from '@nestjs/swagger';
import {IsLabExist} from 'src/lab/decorator/is-lab-exist.decorator';

export class CreateUserDto {
    @ApiProperty({type: CreateAccountDto})
    @IsDefined()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => CreateAccountDto)
    account: CreateAccountDto;

    @ApiProperty({
        description: 'Rol del usuario.',
        enum: UserRole,
        default: UserRole.EMPLOYEE,
        required: false,
    })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @ApiProperty({
        description: 'Cargo del usuario.',
        minimum: 3,
        maximum: 255,
    })
    @IsNotEmpty()
    @IsString()
    @Length(3, 255)
    jobTitle: string;

    @ApiProperty({
        description: 'Denominación del usuario.',
        minimum: 3,
        maximum: 255,
    })
    @IsNotEmpty()
    @IsString()
    @Length(3, 255)
    denomination: string;

    @ApiProperty({
        description: 'Fecha de nacimiento del usuario.',
        type: 'date',
    })
    @IsOptional()
    @Type(() => Date)
    @Transform(({value}) => new Date(value))
    @IsDate()
    birthdate?: Date;

    @ApiProperty({
        description: 'Id del laboratorio al que pertenece el usuario',
    })
    @IsOptional()
    @IsInt()
    @IsPositive()
    @IsLabExist()
    labId?: number;
}
