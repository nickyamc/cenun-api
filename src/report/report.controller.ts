import { Controller, Get, ParseIntPipe, Query, Res } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ReportService } from "./report.service";
import { RequestUser } from "src/common/intefaces/request-user";
import { GetRequestUser } from "src/common/decorators/GetRequestUser.decorator";
import { Role } from "src/auth/enum/role.enum";
import { Auth } from "src/auth/decorator/auth.decorator";

@ApiBearerAuth()
@ApiTags('Report')
@Controller('report')
export class ReportController {
    constructor(private reportservice: ReportService) {}

    @Auth(Role.ADMIN, Role.EMPLOYEE)
    @Get('dashboard/attendaces-by-lab-and-date')
    async attendancesByLabAndDate(
        @GetRequestUser() requestUser: RequestUser
    ): Promise<any> {
        return await this.reportservice.attendancesByLabAndDate(requestUser);
    }

    @Auth(Role.ADMIN, Role.EMPLOYEE)
    @Get('dashboard/attendaces-by-specialist')
    async attendancesByUser(
        @GetRequestUser() requestUser: RequestUser
    ): Promise<any> {
        return await this.reportservice.attendancesByUser(requestUser);
    }

    @Auth(Role.ADMIN, Role.EMPLOYEE)
    @Get('dashboard/number-visitors')
    async numberOfVisitors(): Promise<number> {
        return await this.reportservice.numberOfVisitors();
    }

    @Auth(Role.ADMIN, Role.EMPLOYEE)
    @Get('dashboard/number-events')
    async numberOfEvents(): Promise<number> {
        return await this.reportservice.numberOfEvents();
    }

    @Auth(Role.ADMIN, Role.EMPLOYEE)
    @Get('dashboard/number-labs')
    async numberOfLabs(): Promise<number> {
        return await this.reportservice.numberOfLabs();
    }

    @Auth(Role.ADMIN, Role.EMPLOYEE)
    @Get('dashboard/number-attendances')
    async numberOfAttendances(
        @GetRequestUser() requestUser: RequestUser
    ): Promise<number> {
        return await this.reportservice.numberOfAttendances(requestUser);
    }

    @Auth(Role.ADMIN, Role.EMPLOYEE)
    @Get("pdf/attendances-by-user")
    async pdfAttendancesByUser(
        @Res() res,
        @Query('month', ParseIntPipe) month: number, 
        @GetRequestUser() requestUser: RequestUser
    ): Promise<void> {
        const buffer = await this.reportservice.pdfAttendancesByUser(month, requestUser);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=example.pdf',
            'Content-Length': buffer.length,
        })

        res.end(buffer);
    }

}