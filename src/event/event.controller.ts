import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {EventService} from './event.service';
import {CreateEventDto} from './dto/create-event.dto';
import {RelationsEventDto} from './dto/relations-event.dto';
import {UpdateEventDto} from './dto/update-event.dto';
import {Role} from "../auth/enum/role.enum";
import {Auth} from "../auth/decorator/auth.decorator";
import {ApiBodyTemplate} from "../common/decorators/ApiBodyTemplate.decorator";
import {ApiQueriesByRelations} from "../common/decorators/ApiQueriesByRelations.decorator";
import {ApiRequestByIdAndRelations} from "../common/decorators/ApiRequestByIdAndRelations.decorator";
import {IdentifyEventDto} from "./dto/identify-event.dto";
import {ApiRequestByBodyAndId} from "../common/decorators/ApiRequestByBodyAndId.decorator";
import {ApiParamById} from "../common/decorators/ApiParamById.decorator";
import {Evento} from "./event.entity";
import {UpdateResult} from "typeorm";

@ApiBearerAuth()
@ApiTags('Event')
@Controller('event')
export class EventController {
    constructor(private eventService: EventService) {
    }

    @ApiBodyTemplate('event', CreateEventDto)
    @Auth(Role.ADMIN)
    @Post()
    create(@Body() event: CreateEventDto): Promise<Evento> {
        return this.eventService.create(event);
    }

    @ApiQueriesByRelations('labs', 'visitors', 'attendances')
    @Auth(Role.ADMIN, Role.EMPLOYEE)
    @Get()
    findAll(
        @Query() relations: RelationsEventDto,
    ): Promise<Evento[]> {
        return this.eventService.findAll(relations);
    }

    @ApiRequestByIdAndRelations('event', ['labs', 'visitors', 'attendances'])
    @Auth(Role.ADMIN, Role.EMPLOYEE)
    @Get(':id')
    findOneById(
        @Param() identify: IdentifyEventDto,
        @Query() relations: RelationsEventDto,
    ): Promise<Evento> {
        return this.eventService.findOneById(identify.id, relations);
    }

    @ApiRequestByBodyAndId('event', UpdateEventDto, true)
    @Auth(Role.ADMIN)
    @Patch(':id')
    update(
        @Param() identify: IdentifyEventDto,
        @Body() event: UpdateEventDto
    ): Promise<UpdateResult> {
        return this.eventService.update(identify.id, event);
    }

    @ApiParamById('event')
    @Auth(Role.ADMIN)
    @Delete(':id')
    delete(@Param() identify: IdentifyEventDto): Promise<UpdateResult> {
        return this.eventService.delete(identify.id);
    }
}
