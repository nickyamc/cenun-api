import { Module } from '@nestjs/common';
import {UserModule} from "../user/user.module";
import {SessionModule} from "../session/session.module";
import { LabModule } from 'src/lab/lab.module';
import { AttendanceModule } from 'src/attendance/attendance.module';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { VisitorModule } from 'src/visitor/visitor.module';
import { EventModule } from 'src/event/event.module';

@Module({
	imports: [
		UserModule, 
		SessionModule, 
		LabModule, 
		AttendanceModule, 
		VisitorModule,
		EventModule
	],
	providers: [ReportService],
	controllers: [ReportController],
	exports: [ReportService]
})
export class ReportModule {}
