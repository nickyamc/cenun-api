import {ApiProperty} from "@nestjs/swagger";
import {SessionEntry} from "../enums";
import {IsEnum, IsInt, IsNotEmpty, IsPositive} from "class-validator";
import {IsUserExist} from "../../user/decorator/is-user-exist.decorator";
import {NotExistSessionByUserId} from "../decorator/not-exist-session-by-user-id.decorator";

export class CreateSessionDto {
    @ApiProperty({
        enum: SessionEntry,
    })
    @IsNotEmpty()
    @IsEnum(SessionEntry)
    entry: SessionEntry;

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    @IsUserExist()
    @NotExistSessionByUserId()
    userId: number;
}