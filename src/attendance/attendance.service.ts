import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Attendance} from './attendance.entity';
import {Between, In, Repository, UpdateResult} from 'typeorm';
import {CreateAttendanceDto} from './dto/create-attendance.dto';
import {RelationsAttendanceDto} from './dto/relations-attendance.dto';
import {DatesAttendanceDto} from './dto/dates-attendance.dto';

@Injectable()
export class AttendanceService {
    constructor(
        @InjectRepository(Attendance)
        private attendanceRepository: Repository<Attendance>,
    ) {
    }

    async create(attendance: CreateAttendanceDto): Promise<Attendance> {
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
}
