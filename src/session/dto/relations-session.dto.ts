import {Transform} from 'class-transformer';
import {IsBoolean, IsOptional} from 'class-validator';

export class RelationsSessionDto {
    @IsOptional()
    @IsBoolean()
    @Transform(({value, key, obj}) => obj[key].toLowerCase().trim() === 'true')
    user?: boolean;
}
