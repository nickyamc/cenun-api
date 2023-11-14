import {Transform, Type} from 'class-transformer';
import {IsBoolean, IsOptional} from 'class-validator';

export class RelationsUserDto {
    @IsOptional()
    @IsBoolean()
    @Transform(({value, key, obj}) => obj[key].toLowerCase().trim() === 'true')
    lab?: boolean;
}
