import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
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

@ApiBearerAuth()
@ApiTags('Session')
@Controller('session')
export class SessionController {
    constructor(private sessionService: SessionService) {
    }

    @ApiBodyTemplate('session', CreateSessionDto)
    //@Auth(Role.EMPLOYEE)
    @Post()
    async create(@Body() createSessionDto: CreateSessionDto): Promise<SessionEntity> {
        return this.sessionService.create(createSessionDto);
    }

    @ApiQueriesByRelations('user')
    @Auth(Role.ADMIN)
    @Get()
    async findAll(@Query() relations: RelationsSessionDto): Promise<SessionEntity[]> {
        return await this.sessionService.findAll(relations);
    }

    @ApiRequestByIdAndRelations('session', ['user'])
    //@Auth(Role.EMPLOYEE)
    @Get(':id')
    async findOneById(
        @Param() identify: IdentifySessionDto,
        @Query() relations: RelationsSessionDto,
    ): Promise<SessionEntity> {
        return await this.sessionService.findOneById(identify.id, relations);
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
    @Auth(Role.ADMIN)
    @Delete(':id')
    async delete(
        @Param() identify: IdentifySessionDto,
    ): Promise<UpdateResult> {
        return await this.sessionService.delete(identify.id);
    }
}
