import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {LabService} from './lab.service';
import {CreateLabDto} from './dto/create-lab.dto';
import {RelationsLabDto} from './dto/relations-lab.dto';
import {UpdateLabDto} from './dto/update-lab.dto';
import {ApiQueriesByRelations} from "../common/decorators/ApiQueriesByRelations.decorator";
import {ApiRequestByIdAndRelations} from "../common/decorators/ApiRequestByIdAndRelations.decorator";
import {ApiParamById} from "../common/decorators/ApiParamById.decorator";
import {ApiBodyTemplate} from "../common/decorators/ApiBodyTemplate.decorator";
import {ApiRequestByBodyAndId} from "../common/decorators/ApiRequestByBodyAndId.decorator";
import {Auth} from "../auth/decorator/auth.decorator";
import {Role} from "../auth/enum/role.enum";
import {IdentifyLabDto} from "./dto/identify-lab.dto";
import {GetRequestUser} from "../common/decorators/GetRequestUser.decorator";
import {RequestUser} from "../common/intefaces/request-user";
import {Lab} from "./lab.entity";
import {UpdateResult} from "typeorm";

@ApiBearerAuth()
@ApiTags('Lab')
@Controller('lab')
export class LabController {
    constructor(private labService: LabService) {
    }

    @ApiBodyTemplate('lab', CreateLabDto)
    @Auth(Role.ADMIN)
    @Post()
    async create(@Body() lab: CreateLabDto): Promise<Lab> {
        return await this.labService.create(lab);
    }

    @ApiQueriesByRelations('users', 'events', 'attendances')
    @Auth(Role.ADMIN)
    @Get()
    async findAll(@Query() relations: RelationsLabDto): Promise<Lab[]> {
        return await this.labService.findAll(relations);
    }


    @ApiRequestByIdAndRelations('lab', ['users', 'events', 'attendances'])
    @Auth(Role.EMPLOYEE)
    @Get(':id')
    async findOneById(
        @Param() identify: IdentifyLabDto,
        @Query() relations: RelationsLabDto,
        @GetRequestUser() requestUser: RequestUser
    ): Promise<Lab> {
        return await this.labService.findOneById(identify.id, relations, requestUser);
    }

    @ApiRequestByBodyAndId('lab', UpdateLabDto, true)
    @Auth(Role.ADMIN)
    @Patch(':id')
    async update(
        @Param() identify: IdentifyLabDto,
        @Body() lab: UpdateLabDto,
    ): Promise<UpdateResult> {
        return await this.labService.update(identify.id, lab);
    }

    @ApiParamById('lab')
    @Auth(Role.ADMIN)
    @Delete(':id')
    async delete(@Param() identify: IdentifyLabDto): Promise<UpdateResult> {
        return await this.labService.delete(identify.id);
    }
}
