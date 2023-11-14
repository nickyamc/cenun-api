import {Visitor} from 'src/visitor/visitor.entity';
import {DateRecord} from 'src/entities/dateRecord.entity';
import {Evento} from 'src/event/event.entity';
import {Lab} from 'src/lab/lab.entity';
import {
    Column,
    Entity,
    Generated,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {SessionEntity} from "../session/session.entity";

@Entity({name: 'attendance'})
export class Attendance {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'check_code', unique: true})
    @Generated('uuid')
    checkCode: string;

    @Column(() => DateRecord, {prefix: false})
    dateRecord: DateRecord;

    @Column({name: 'visitor_id'})
    visitorId: number;

    @Column({name: 'lab_id'})
    labId: number;

    @Column({name: 'event_id'})
    eventId: number;

    @Column({name:'session_id'})
    sessionId: number;

    @ManyToOne(() => Visitor, (visitor: Visitor) => visitor.attendances)
    @JoinColumn({name: 'visitor_id'})
    visitor: Visitor;

    @ManyToOne(() => Lab, (lab: Lab) => lab.attendances)
    @JoinColumn({name: 'lab_id'})
    lab: Lab;

    @ManyToOne(() => Evento, (event: Evento) => event.attendances)
    @JoinColumn({name: 'event_id'})
    event: Evento;

    @ManyToOne(() => SessionEntity, (session: SessionEntity) => session.attendances)
    @JoinColumn({name: 'session_id'})
    session: SessionEntity;
}
