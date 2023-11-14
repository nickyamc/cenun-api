import {applyDecorators} from "@nestjs/common";
import {ApiParamById} from "./ApiParamById.decorator";
import {ApiBodyTemplate} from "./ApiBodyTemplate.decorator";

export function ApiRequestByBodyAndId(idOf: string, dto: Function, update: boolean = false) {
    return applyDecorators(
        ApiParamById(idOf),
        ApiBodyTemplate(idOf, dto, update)
    )
}