import {applyDecorators} from "@nestjs/common";
import {ApiQuery} from "@nestjs/swagger";

export function ApiQueriesByRelations(...relations: string[]) {
    return applyDecorators(
        ...relations.map((value: string) => {
            return ApiQuery({
                name: value,
                required: false,
                type: Boolean,
                description: `Include ${value}`,
                example: true
            })
        })
    )
}