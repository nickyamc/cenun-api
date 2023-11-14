import {
	Column,
	Entity,
	Generated,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
	RelationId,
} from 'typeorm';
import { VisitorType } from './enums';
import { DateRecord } from 'src/entities/dateRecord.entity';
import { Account } from 'src/entities/account.entity';
import { Evento } from 'src/event/event.entity';
import { Attendance } from 'src/attendance/attendance.entity';

@Entity({ name: 'visitor' })
export class Visitor {
	@PrimaryGeneratedColumn()
	id: number;

	@Column(() => Account, { prefix: false })
	account: Account;

	@Column({
		type: 'enum',
		enum: VisitorType,
		default: VisitorType.STUDENT,
	})
	type: VisitorType;

	@Column({ name: 'student_code', unique: true })
	studentCode: string;

	@Column({ name: 'qr_code', unique: true })
	@Generated('uuid')
	qrCode: string;

	@Column()
	university: string;

	@Column()
	career: string;

	@RelationId((visitor: Visitor) => visitor.events)
	eventIds: number[];

	@Column(() => DateRecord, { prefix: false })
	dateRecord: DateRecord;

	@ManyToMany(() => Evento, (event) => event.visitors, { cascade: true })
	@JoinTable({
		name: 'visitor_event',
		joinColumn: {
			name: 'visitor_id',
		},
		inverseJoinColumn: {
			name: 'event_id',
		},
	})
	events: Evento[];

	@OneToMany(() => Attendance, (attendance) => attendance.visitor)
	attendances: Attendance[];
}
