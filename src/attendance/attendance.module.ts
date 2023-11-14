import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity';
import {IsAttendanceExistConstraint} from "./validation/is-attendance-exist.validation";

@Module({
	imports: [TypeOrmModule.forFeature([Attendance])],
	providers: [AttendanceService, IsAttendanceExistConstraint],
	controllers: [AttendanceController],
	exports: [AttendanceService]
})
export class AttendanceModule {}
