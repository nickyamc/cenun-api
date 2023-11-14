import {Role} from "../enum/role.enum";
import {applyDecorators, UseGuards} from "@nestjs/common";
import {Roles} from "./roles.decorator";
import {AuthGuard} from "@nestjs/passport";
import {JwtAuthGuard} from "../guard/jwt-auth.guard";
import {RolesGuard} from "../guard/roles.guard";

export function Auth(...roles: Role[]) {
    return applyDecorators(
        Roles(...roles),
        UseGuards(JwtAuthGuard, RolesGuard)
    )
}