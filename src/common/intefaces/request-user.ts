import {Role} from "../../auth/enum/role.enum";

export interface RequestUser {
    username: string,
    role: Role,
    id: number
}