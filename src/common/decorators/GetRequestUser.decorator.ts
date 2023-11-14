import {ExecutionContext, createParamDecorator} from '@nestjs/common';
import {RequestUser} from "../intefaces/request-user";

export const GetRequestUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user
    }
)