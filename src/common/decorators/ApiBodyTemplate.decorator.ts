import {applyDecorators} from "@nestjs/common";
import {ApiBody} from "@nestjs/swagger";

export function ApiBodyTemplate(dtoOf: string, dto: Function, update: boolean = false) {
    return applyDecorators(
        ApiBody({
            type: dto,
            description: `Data to ${update ? 'update' : 'create'} a ${dtoOf}`,
        }),
    )
}