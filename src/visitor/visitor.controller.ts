import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query,} from '@nestjs/common';
import {VisitorService} from './visitor.service';
import {CreateVisitorDto} from './dto/create-visitor.dto';
import {RelationsVisitorDto} from './dto/relations-visitor.dto';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {UpdateVisitorDto} from './dto/update-visitor.dto';
import {ApiQueriesByRelations} from "../common/decorators/ApiQueriesByRelations.decorator";
import {ApiRequestByIdAndRelations} from "../common/decorators/ApiRequestByIdAndRelations.decorator";
import {IdentifyVisitorDto} from "./dto/identify-visitor.dto";
import {ApiParamById} from "../common/decorators/ApiParamById.decorator";
import {Auth} from "../auth/decorator/auth.decorator";
import {Role} from "../auth/enum/role.enum";
import {ApiBodyTemplate} from "../common/decorators/ApiBodyTemplate.decorator";
import {ApiRequestByBodyAndId} from "../common/decorators/ApiRequestByBodyAndId.decorator";

@ApiBearerAuth()
@ApiTags('Visitor')
@Controller('visitor')
export class VisitorController {
    constructor(private visitorService: VisitorService) {
    }

    @ApiBodyTemplate('visitor', CreateVisitorDto)
    //@Auth(Role.VISITOR, Role.EMPLOYEE)
    @Post()
    async create(@Body() visitor: CreateVisitorDto) {
        return await this.visitorService.create(visitor);
    }

    @ApiQueriesByRelations('events', 'attendances')
    @Auth(Role.ADMIN, Role.EMPLOYEE)
    @Get()
    async findAll(@Query() relations: RelationsVisitorDto) {
        return await this.visitorService.findAll(relations);
    }

    @ApiQueriesByRelations('events', 'attendances')
    @Auth(Role.ADMIN, Role.EMPLOYEE)
    @Get('username/:username')
    async findAllByUsername(
        @Param('username') username: string,
        @Query() relations: RelationsVisitorDto
    ) {
        return await this.visitorService.findAllByUsername(username, relations);
    }

    @ApiRequestByIdAndRelations('visitor', ['events', 'attendances'])
    @Auth(Role.VISITOR, Role.EMPLOYEE)
    @Get(':id')
    async findOneById(
        @Param() identify: IdentifyVisitorDto,
        @Query() relations: RelationsVisitorDto,
    ) {
        return await this.visitorService.findOneById(identify.id, relations);
    }

    @ApiRequestByBodyAndId('visitor', UpdateVisitorDto, true)
    @Auth(Role.VISITOR, Role.EMPLOYEE)
    @Patch(':id')
    async update(
        @Param() identify: IdentifyVisitorDto,
        @Body() customer: UpdateVisitorDto,
    ) {
        return await this.visitorService.update(identify.id, customer);
    }

    @ApiParamById('visitor')
    @Auth(Role.EMPLOYEE)
    @Delete(':id')
    async delete(@Param() identify: IdentifyVisitorDto) {
        return await this.visitorService.delete(identify.id);
    }
}
