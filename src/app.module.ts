import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LabModule } from './lab/lab.module';
import { EventModule } from './event/event.module';
import { UserModule } from './user/user.module';
import { VisitorModule } from './visitor/visitor.module';
import { AuthModule } from './auth/auth.module';
import { AttendanceModule } from './attendance/attendance.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Visitor } from './visitor/visitor.entity';
import { Evento } from './event/event.entity';
import { Lab } from './lab/lab.entity';
import { Attendance } from './attendance/attendance.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { cwd, env } from 'process';
import { SessionModule } from './session/session.module';
import {SessionEntity} from "./session/session.entity";

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: `${cwd()}/.env.${env.NODE_ENV}`,
			load: [configuration],
			isGlobal: true,
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configureService: ConfigService) => ({
				type: 'postgres',
				host: configureService.get<string>('database.host'),
				port: configureService.get<number>('database.port'),
				username: configureService.get<string>('database.username'),
				password: configureService.get<string>('database.password'),
				database: configureService.get<string>('database.database'),
				entities: [User, Visitor, Evento, Lab, Attendance, SessionEntity],
				uuidExtension: 'uuid-ossp', // o 'pgcrypto' o 'uuid-ossp'
				synchronize: true,
				logging: true,
			}),
			inject: [ConfigService],
		}),
		LabModule,
		EventModule,
		UserModule,
		VisitorModule,
		AuthModule,
		AttendanceModule,
		SessionModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
	static port: number;
	constructor(private readonly configService: ConfigService) {
		AppModule.port = this.configService.get<number>('port')
	}
}
