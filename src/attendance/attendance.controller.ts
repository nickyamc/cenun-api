import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiParam, ApiTags} from "@nestjs/swagger";
import {AttendanceService} from "./attendance.service";
import {CreateAttendanceDto} from "./dto/create-attendance.dto";
import {Attendance} from "./attendance.entity";
import {RelationsAttendanceDto} from "./dto/relations-attendance.dto";
import {DatesAttendanceDto} from "./dto/dates-attendance.dto";
import {ApiBodyTemplate} from "../common/decorators/ApiBodyTemplate.decorator";
import {ApiQueriesByRelations} from "../common/decorators/ApiQueriesByRelations.decorator";
import {ApiParamById} from "../common/decorators/ApiParamById.decorator";
import {ApiRequestByIdAndRelations} from "../common/decorators/ApiRequestByIdAndRelations.decorator";
import {IdentifyVisitorDto} from "../visitor/dto/identify-visitor.dto";
import {IdentifyLabDto} from "../lab/dto/identify-lab.dto";
import {IdentifyEventDto} from "../event/dto/identify-event.dto";
import {Auth} from "../auth/decorator/auth.decorator";
import {Role} from "../auth/enum/role.enum";
import {IdentifyAttendanceDto} from "./dto/identify-attendance.dto";
import {UpdateResult} from "typeorm";
import {IdAttendanceDto} from "./dto/id-attendance.dto";
import {GetRequestUser} from "../common/decorators/GetRequestUser.decorator";
import {RequestUser} from "../common/intefaces/request-user";

@ApiBearerAuth()
@ApiTags('Attendance')
@Controller('attendance')
export class AttendanceController {
    constructor(private attendanceService: AttendanceService) {
    }

    @ApiBodyTemplate('attendance', CreateAttendanceDto)
    @Auth(Role.EMPLOYEE, Role.VISITOR)
    @Post()
    async create(
        @Body() attendance: CreateAttendanceDto,
        @GetRequestUser() requestUser: RequestUser,
    ): Promise<Attendance> {
        return await this.attendanceService.create(attendance, requestUser);
    }

    @ApiQueriesByRelations('visitor', 'lab', 'event')
    @ApiBody({type: DatesAttendanceDto})
    //@Auth(Role.ADMIN)
    @Post("all")
    async findAll(
        @Query() relations: RelationsAttendanceDto,
        @Body() dates: DatesAttendanceDto
    ): Promise<Attendance[]> {
        return await this.attendanceService.findALl(relations, dates);
    }

    @ApiRequestByIdAndRelations('visitor', ['visitor', 'lab', 'event'])
    @ApiBody({type: DatesAttendanceDto})
    @Auth(Role.EMPLOYEE, Role.VISITOR)
    @Post("all/visitor/:id")
    async findAllByVisitorId(
        @Param() visitorIdentify: IdentifyVisitorDto,
        @Query() relations: RelationsAttendanceDto,
        @Body() dates: DatesAttendanceDto
    ): Promise<Attendance[]> {
        return await this.attendanceService.findAllByVisitorId(visitorIdentify.id, relations, dates);
    }

    @ApiRequestByIdAndRelations('lab', ['visitor', 'lab', 'event'])
    @ApiBody({type: DatesAttendanceDto})
    @Auth(Role.EMPLOYEE)
    @Post("all/lab/:id")
    async findAllByLabId(
        @Param() labIdentify: IdentifyLabDto,
        @Query() relations: RelationsAttendanceDto,
        @Body() dates: DatesAttendanceDto
    ): Promise<Attendance[]> {
        return await this.attendanceService.findAllByLabId(labIdentify.id, relations, dates);
    }

    @ApiRequestByIdAndRelations('event', ['visitor', 'lab', 'event'])
    @ApiBody({type: DatesAttendanceDto})
    @Auth(Role.ADMIN)
    @Post("all/event/:id")
    async findAllByEventId(
        @Param() eventIdentify: IdentifyEventDto,
        @Query() relations: RelationsAttendanceDto,
        @Body() dates: DatesAttendanceDto
    ): Promise<Attendance[]> {
        return await this.attendanceService.findAllByEventId(eventIdentify.id, relations, dates);
    }

    @ApiParam({
        name: 'identify',
        required: true,
        type: String,
        description: 'Attendance id or check code'
    })
    @ApiQueriesByRelations('visitor', 'lab', 'event')
    //@Auth(Role.EMPLOYEE, Role.VISITOR)
    @Get(':identify')
    async findOneByIdOrCheckCode(
        @Param() identify: IdentifyAttendanceDto,
        @Query('query') relations: RelationsAttendanceDto
    ): Promise<Attendance> {
        return await this.attendanceService.findOneByIdOrCheckCode(identify.identify, relations);
    }

    @ApiParamById('attendance')
    @Delete(':id')
    async delete(@Param() identify: IdAttendanceDto): Promise<UpdateResult> {
        return await this.attendanceService.delete(Number(identify.id));
    }
}
