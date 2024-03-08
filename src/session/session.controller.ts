import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {SessionService} from "./session.service";
import {ApiBodyTemplate} from "../common/decorators/ApiBodyTemplate.decorator";
import {CreateSessionDto} from "./dto/create-session.dto";
import {Auth} from "../auth/decorator/auth.decorator";
import {Role} from "../auth/enum/role.enum";
import {SessionEntity} from "./session.entity";
import {ApiQueriesByRelations} from "../common/decorators/ApiQueriesByRelations.decorator";
import {RelationsSessionDto} from "./dto/relations-session.dto";
import {ApiRequestByIdAndRelations} from "../common/decorators/ApiRequestByIdAndRelations.decorator";
import {IdentifySessionDto} from "./dto/identify-session.dto";
import {ApiRequestByBodyAndId} from "../common/decorators/ApiRequestByBodyAndId.decorator";
import {UpdateSessionDto} from "./dto/update-session.dto";
import {UpdateResult} from "typeorm";
import {ApiParamById} from "../common/decorators/ApiParamById.decorator";
import {GetRequestUser} from "../common/decorators/GetRequestUser.decorator";
import {RequestUser} from "../common/intefaces/request-user";

@ApiBearerAuth()
@ApiTags('Session')
@Controller('session')
export class SessionController {
    constructor(private sessionService: SessionService) {
    }

    @ApiBodyTemplate('session', CreateSessionDto)
    @Auth(Role.EMPLOYEE)
    @Post()
    async create(
        @Body() createSessionDto: CreateSessionDto,
        @GetRequestUser() requestUser: RequestUser,
    ): Promise<SessionEntity> {
        return this.sessionService.create(createSessionDto, requestUser);
    }

    @ApiQueriesByRelations('user')
    @Auth(Role.ADMIN, Role.EMPLOYEE)
    @Get()
    async findAll(
        @Query() relations: RelationsSessionDto,
        @GetRequestUser() requestUser: RequestUser,
    ): Promise<SessionEntity[]> {
        return await this.sessionService.findAll(relations, requestUser);
    }

    @ApiRequestByIdAndRelations('session', ['user'])
    @Auth(Role.EMPLOYEE)
    @Get(':id')
    async findOneById(
        @Param() identify: IdentifySessionDto,
        @Query() relations: RelationsSessionDto,
    ): Promise<SessionEntity> {
        return await this.sessionService.findOneById(identify.id, relations);
    }

    @ApiParamById('user')
    @Auth(Role.EMPLOYEE)
    @Get('user/:userId')
    async findOneByUserId(
        @Param('userId', ParseIntPipe) userId: number,
        @GetRequestUser() requestUser: RequestUser,
    ): Promise<SessionEntity> {
        return await this.sessionService.findOneByUserId(userId, requestUser);
    }

    @ApiParamById('user')
    @Auth(Role.EMPLOYEE)
    @Get('all/user/:userId')
    async findAllByUserId(
        @Param('userId', ParseIntPipe) userId: number,
        @GetRequestUser() requestUser: RequestUser,
    ): Promise<SessionEntity[]> {
        return await this.sessionService.findAllByUserId(userId, requestUser);
    }

    @ApiRequestByIdAndRelations('session', ['user'])
    //@Auth(Role.EMPLOYEE)
    @Get('/qr-reader/:checkCode')
    async findOneByCheckCode(
        @Param('checkCode') checkCode: string,
        @Query() relations: RelationsSessionDto,
    ): Promise<SessionEntity> {
        return await this.sessionService.findOneByCheckCode(checkCode, relations);
    }

    @ApiRequestByBodyAndId('session', UpdateSessionDto, true)
    @Auth(Role.EMPLOYEE)
    @Patch(':id')
    async update(
        @Param() identify: IdentifySessionDto,
        @Body() updateSessionDto: UpdateSessionDto,
    ): Promise<UpdateResult> {
        return await this.sessionService.update(identify.id, updateSessionDto);
    }

    @ApiParamById('session')
    @Auth(Role.EMPLOYEE)
    @Patch('close/:id')
    async closeSession(
        @Param() identify: IdentifySessionDto,
        @GetRequestUser() requestUser: RequestUser,
    ): Promise<UpdateResult> {
        return await this.sessionService.closeSession(identify.id, requestUser);
    }

    @ApiParamById('session')
    @Auth(Role.ADMIN)
    @Delete(':id')
    async delete(
        @Param() identify: IdentifySessionDto,
    ): Promise<UpdateResult> {
        return await this.sessionService.delete(identify.id);
    }
}
