import {Injectable, NotAcceptableException, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Attendance} from './attendance.entity';
import {Between, In, Repository, UpdateResult} from 'typeorm';
import {CreateAttendanceDto} from './dto/create-attendance.dto';
import {RelationsAttendanceDto} from './dto/relations-attendance.dto';
import {DatesAttendanceDto} from './dto/dates-attendance.dto';
import {RequestUser} from "../common/intefaces/request-user";
import {Role} from "../auth/enum/role.enum";
import {UserService} from "../user/user.service";
import {SessionService} from "../session/session.service";

@Injectable()
export class AttendanceService {
    constructor(
        @InjectRepository(Attendance)
        private attendanceRepository: Repository<Attendance>,
        private userService: UserService,
        private sessionService: SessionService,
    ) {
    }

    async create(
        attendance: CreateAttendanceDto,
        requestUser: RequestUser,
    ): Promise<Attendance> {
        if (requestUser.role === Role.EMPLOYEE) {
            const user = await this.userService.findOneById(requestUser.id, {}, requestUser)
            if (user.labId !== attendance.labId) throw new UnauthorizedException();
        } else if (requestUser.role === Role.VISITOR){
            if (requestUser.id !== attendance.visitorId) throw new UnauthorizedException();
        } else {
            throw new UnauthorizedException();
        }
        await this.verifyStatusSession(attendance.sessionId);
        await this.notExistByVisitorIdAndLabIdOrFail(attendance.visitorId, attendance.labId);
        const createdAttendance: Attendance = this.attendanceRepository.create(attendance);
        return this.attendanceRepository.save(createdAttendance);
    }

    async findALl(relations: RelationsAttendanceDto, dates: DatesAttendanceDto): Promise<Attendance[]> {
        return await this.attendanceRepository.find({
            where: {
                dateRecord: this.getDateRecord(dates),
            },
            relations,
        })
    }

    async findAllByVisitorId(
        visitorId: number,
        relations: RelationsAttendanceDto,
        dates: DatesAttendanceDto
    ): Promise<Attendance[]> {
        return await this.attendanceRepository.find({
            where: {
                visitorId,
                dateRecord: this.getDateRecord(dates),
            },
            relations,
        });
    }

    async findAllByLabId(
        labId: number,
        relations: RelationsAttendanceDto,
        dates: DatesAttendanceDto
    ): Promise<Attendance[]> {
        return await this.attendanceRepository.find({
            where: {
                labId,
                dateRecord: this.getDateRecord(dates),
            },
            relations,
        });
    }

    async findAllByEventId(
        eventId: number,
        relations: RelationsAttendanceDto,
        dates: DatesAttendanceDto
    ): Promise<Attendance[]> {
        return await this.attendanceRepository.find({
            where: {
                eventId,
                dateRecord: this.getDateRecord(dates),
            },
            relations,
        });
    }

    async findOneByIdOrCheckCode(
        identify: string,
        relations: RelationsAttendanceDto,
    ): Promise<Attendance> {
        return await this.attendanceRepository.findOne({
            where: [{id: Number(identify)}, {checkCode: identify}],
            relations,
        });
    }

    async delete(id: number): Promise<UpdateResult> {
        return await this.attendanceRepository.softDelete(id)
    }

    async findOneOrFail(id: number): Promise<Attendance> {
        return await this.attendanceRepository.findOneOrFail({where: {id}})
    }

    async findOneByIdOrCheckCodeOrFail(identify: string | number): Promise<Attendance> {
        return await this.attendanceRepository.findOneOrFail({
            where: [
                {id: Number(identify)},
                {checkCode: String(identify)}
            ]
        })
    }

    async findAllOrFail(ids: number[]) {
        const attendances: Attendance[] = await this.attendanceRepository.findBy({id: In(ids)});
        if (attendances.length === 0) throw new Error();
        if (attendances.some((attendance: Attendance) => !ids.includes(attendance.id))) throw new Error();
    }

    getDateRecord(dates: DatesAttendanceDto) {
        const {startDate, endDate} = dates;
        return {
            createdAt: Between(
                startDate ? startDate : new Date('1900-01-01'),
                endDate ? endDate : new Date(),
            ),
        }
    }

    async notExistByVisitorIdAndLabIdOrFail(visitorId: number, labId: number) {
        const sessions = await this.attendanceRepository.createQueryBuilder('attendance')
            .where('DATE_TRUNC(\'day\', attendance.createdAt) = :today', {today: new Date().toISOString().split('T')[0]})
            .andWhere('attendance.visitor_id = :visitorId', {visitorId})
            .andWhere('attendance.lab_id = :labId', {labId})
            .getCount();
        if (sessions > 0) throw new NotAcceptableException();
    }

    async verifyStatusSession(sessionId: number) {
        const session = await this.sessionService.findOneById(sessionId, {});
        if (!session.status) throw new NotAcceptableException();
        if (session.dateRecord.createdAt.getDate() !== new Date().getDate()) {
            await this.sessionService.closeSession(sessionId);
            throw new NotAcceptableException();
        }
    }
}
