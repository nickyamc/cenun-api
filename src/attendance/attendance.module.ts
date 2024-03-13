import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity';
import {IsAttendanceExistConstraint} from "./validation/is-attendance-exist.validation";
import {UserModule} from "../user/user.module";
import {SessionModule} from "../session/session.module";
import { LabModule } from 'src/lab/lab.module';

@Module({
	imports: [TypeOrmModule.forFeature([Attendance]), UserModule, SessionModule, LabModule],
	providers: [AttendanceService, IsAttendanceExistConstraint],
	controllers: [AttendanceController],
	exports: [AttendanceService]
})
export class AttendanceModule {}
