import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {LabModule} from './lab/lab.module';
import {EventModule} from './event/event.module';
import {UserModule} from './user/user.module';
import {VisitorModule} from './visitor/visitor.module';
import {AuthModule} from './auth/auth.module';
import {AttendanceModule} from './attendance/attendance.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './user/user.entity';
import {Visitor} from './visitor/visitor.entity';
import {Evento} from './event/event.entity';
import {Lab} from './lab/lab.entity';
import {Attendance} from './attendance/attendance.entity';
import {ConfigModule, ConfigService} from '@nestjs/config';
import configuration from './config/configuration';
import {cwd, env} from 'process';
import {SessionModule} from './session/session.module';
import {SessionEntity} from "./session/session.entity";
import {DatabaseType} from "typeorm/driver/types/DatabaseType";
import { ReportModule } from './report/report.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `${cwd()}/.env`,//.${env.NODE_ENV}
            load: [configuration],
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                type: configService.get<DatabaseType>('database.type') as any,
                host: configService.get<string>(`database.host`),
                port: configService.get<number>(`${configService.get<string>('database.type')}.port`),
                username: configService.get<string>(`${configService.get<string>('database.type')}.username`),
                password: configService.get<string>(`${configService.get<string>('database.type')}.password`),
                database: configService.get<string>(`${configService.get<string>('database.type')}.database`),
                entities: [User, Visitor, Evento, Lab, Attendance, SessionEntity],
                logging: false,
                //autoLoadEntities: true,
                uuidExtension: 'uuid-ossp', // o 'pgcrypto' o 'uuid-ossp'
                synchronize: true,
                ssl: configService.get<boolean>('database.ssl'),
                extra: {
                    ssl: configService.get<boolean>('database.ssl')
                        ? {rejectUnauthorized: false} : null,
                },
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
        ReportModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    static port: number;

    constructor(private readonly configService: ConfigService) {
        console.log(configService.get<DatabaseType>('database.type'))
        console.log(configService.get<string>(`database.host`))
        console.log(configService.get<number>(`${configService.get<string>('database.type')}.port`))
        console.log(configService.get<string>(`${configService.get<string>('database.type')}.username`))
        console.log(configService.get<string>(`${configService.get<string>('database.type')}.password`))
        console.log(configService.get<string>(`${configService.get<string>('database.type')}.database`))

        AppModule.port = this.configService.get<number>('port')
    }
}
