import {applyDecorators} from "@nestjs/common";
import {ApiParam} from "@nestjs/swagger";

export function ApiParamById(idOf: string) {
    return applyDecorators(
        ApiParam({
            name: 'id',
            type: Number,
            required: true,
            description: `${idOf.substring(0,1).toUpperCase() + idOf.substring(1)} id`,
            example: 1
        }),
    )
}