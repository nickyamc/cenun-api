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
import { SessionEntry } from 'src/session/enums';
import { LabService } from 'src/lab/lab.service';
import { UserRole } from 'src/user/enums';

@Injectable()
export class AttendanceService {
    constructor(
        @InjectRepository(Attendance)
        private attendanceRepository: Repository<Attendance>,
        private userService: UserService,
        private sessionService: SessionService,
        private labService: LabService,
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
        await this.notExistByVisitorIdAndSessionIdOrFail(attendance.visitorId, attendance.sessionId);
        const createdAttendance: Attendance = this.attendanceRepository.create(attendance);
        const savedAttendance: Attendance = await this.attendanceRepository.save(createdAttendance);
        return this.attendanceRepository.findOne({
            where: {
                id: savedAttendance.id
            },
            relations: {
                event: true,
                visitor: true,
                lab: true,
                session: true
            }
        })
    }

    async findAll(
        relations: RelationsAttendanceDto, 
        dates: DatesAttendanceDto,
        requestUser: RequestUser
    ): Promise<Attendance[]> {
        if (requestUser.role === Role.EMPLOYEE) {
            //const user = await this.userService.findOneById(requestUser.id, {}, requestUser)
            return await this.attendanceRepository.find({
                where: {
                    session: {
                        userId: requestUser.id
                    },
                    dateRecord: this.getDateRecord(dates),
                },
                relations,
            })
        } else {
            return await this.attendanceRepository.find({
                where: {
                    dateRecord: this.getDateRecord(dates),
                },
                relations,
            })
        }
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

    async notExistByVisitorIdAndSessionIdOrFail(visitorId: number, sessionId: number) {
        const attendance = await this.attendanceRepository.findOne({
            where: {
                visitorId,
                sessionId
            }
        })
        if(attendance) throw new NotAcceptableException();
    }

    async verifyStatusSession(sessionId: number) {
        const session = await this.sessionService.findOneById(sessionId, {});
        if (!session.status) throw new NotAcceptableException();
        const currentDate = new Date();
        const timeZone = -(currentDate.getTimezoneOffset() / 60);
        session.dateRecord.createdAt.setHours(session.dateRecord.createdAt.getHours() - (timeZone + 5));
        currentDate.setHours(currentDate.getHours() - (timeZone + 5));
        if (session.dateRecord.createdAt.getDate() !== currentDate.getDate()) {
            await this.sessionService.closeSession(sessionId);
            throw new NotAcceptableException();
        } else {
            if(session.entry == SessionEntry.MORNING && currentDate.getHours() >= 13) {
                await this.sessionService.closeSession(sessionId);
                throw new NotAcceptableException();
            }
            if(session.entry == SessionEntry.AFTERNOON && currentDate.getHours() >= 21) {
                await this.sessionService.closeSession(sessionId);
                throw new NotAcceptableException();
            }
        }
    }

    async count(requestUser: RequestUser): Promise<number> {
        return await this.attendanceRepository.count({
            where: requestUser.role == Role.ADMIN ? {} : {
                session: {userId: requestUser.id}
            }
        })
    }
}
