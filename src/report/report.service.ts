import { Injectable } from "@nestjs/common";
import { Attendance } from "src/attendance/attendance.entity";
import { AttendanceService } from "src/attendance/attendance.service";
import { RequestUser } from "src/common/intefaces/request-user";
import { EventService } from "src/event/event.service";
import { Lab } from "src/lab/lab.entity";
import { LabService } from "src/lab/lab.service";
import { UserRole } from "src/user/enums";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { VisitorService } from "src/visitor/visitor.service";

@Injectable()
export class ReportService {
    constructor(
        private attendanceService: AttendanceService,
        private labService: LabService,
        private userService: UserService,
        private visitorService: VisitorService,
        private eventService: EventService
    ){}

    async attendancesByLabAndDate(requestUser: RequestUser) {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const firstDay = new Date(year, 0, 1);
        const datesOfYear = [];
        const auxDate = new Date(firstDay);

        while (auxDate <= currentDate) {
            datesOfYear.push(new Date(auxDate));
            auxDate.setDate(auxDate.getDate() + 1);
        }

        const attendances: Attendance[] = await this.attendanceService.findAll(
            {},
            {startDate: firstDay},
            requestUser
        );

        const labs: Lab[] = await this.labService.findAll({});

        const report = [];

        datesOfYear.forEach((date: Date) => {
            labs.forEach((lab: Lab) => {
                report.push({
                    lab: lab.suneduCode,
                    count: attendances.filter((attendance) => attendance.labId === lab.id && attendance.dateRecord.createdAt.getDate() === date.getDate() && attendance.dateRecord.createdAt.getFullYear() === date.getFullYear() && attendance.dateRecord.createdAt.getMonth() === date.getMonth()).length,
                    date: date.getTime(),
                })
            })
        });

        return report;
    }

    async attendancesByUser(requestUser: RequestUser) {
        const attendances: Attendance[] = await this.attendanceService.findAll(
            {
                session: true,
            },
            {},
            requestUser
        );

        const users: User[] = (await this.userService.findAll({})).filter((user: User) => user.role == UserRole.EMPLOYEE);

        const report = [];

        users.forEach((user: User) => {
            report.push({
                user: user.account.firstName,
                count: attendances.filter((attendance: Attendance) => attendance.session.userId == user.id).length
            });
        })

        return report;
    }

    async numberOfVisitors(): Promise<number> {
        return this.visitorService.count();
    }

    async numberOfEvents(): Promise<number> {
        return this.eventService.count();
    }

    async numberOfLabs(): Promise<number> {
        return this.labService.count();
    }

    async numberOfAttendances(requestUser: RequestUser): Promise<number> {
        return this.attendanceService.count(requestUser);
    }
}