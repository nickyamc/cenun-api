import {ApiProperty, OmitType, PartialType} from '@nestjs/swagger';
import {CreateLabDto} from './create-lab.dto';
import {IsOptional, IsString, Length} from "class-validator";

export class UpdateLabDto extends PartialType(
    OmitType(CreateLabDto, ['suneduCode'] as const)
) {
    @ApiProperty({
        description: 'Código sunedu del laboratorio.',
        minLength: 3,
        maxLength: 20,
    })
    @IsOptional()
    @IsString({message: 'El código sunedu del laboratorio debe ser un texto.'})
    @Length(3, 20, {
        message:
            'El código sunedu del laboratorio debe tener entre 3 y 20 caracteres.',
    })
    suneduCode: string;
}
