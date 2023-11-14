import {Attendance} from 'src/attendance/attendance.entity';
import {DateRecord} from 'src/entities/dateRecord.entity';
import {User} from 'src/user/user.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {SessionEntry} from "./enums";

@Entity({name: 'session'})
export class SessionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: SessionEntry,
    })
    entry: string;

    @Column(() => DateRecord, {prefix: false})
    dateRecord: DateRecord;

    @Column({name: 'user_id'})
    userId: number;

    @ManyToOne(() => User, (user: User) => user.sessions)
    @JoinColumn({name: 'user_id'})
    user: User;

    @OneToMany(() => Attendance, (attendance: Attendance) => attendance.session)
    attendances: Attendance[];
}
