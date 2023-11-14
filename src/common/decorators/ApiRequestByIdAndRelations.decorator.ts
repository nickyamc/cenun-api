import {applyDecorators} from "@nestjs/common";
import {ApiQueriesByRelations} from "./ApiQueriesByRelations.decorator";
import {ApiParamById} from "./ApiParamById.decorator";

export function ApiRequestByIdAndRelations(idOf: string, relations: string[]) {
    return applyDecorators(
        ApiParamById(idOf),
        ApiQueriesByRelations(...relations),
    )
}