import { Attendance } from 'src/attendance/attendance.entity';
import { DateRecord } from 'src/entities/dateRecord.entity';
import { Evento } from 'src/event/event.entity';
import { User } from 'src/user/user.entity';
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

@Entity({ name: 'lab' })
export class Lab {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: 'sunedu_code', length: 20, unique: true })
	suneduCode: string;

	@Column()
	location: string;

	@Column({ name: 'qr_code', unique: true })
	@Generated('uuid')
	qrCode: string;

	@Column(() => DateRecord, { prefix: false })
	dateRecord: DateRecord;

	@RelationId((lab: Lab) => lab.events)
	eventIds: number[];

	@RelationId((lab: Lab) => lab.users)
	userIds: number[];

	@OneToMany(() => User, (user: User) => user.lab)
	users: User[];

	@ManyToMany(() => Evento, (event: Evento) => event.labs, { cascade: true })
	@JoinTable({
		name: 'lab_event',
		joinColumn: {
			name: 'lab_id',
		},
		inverseJoinColumn: {
			name: 'event_id',
		},
	})
	events: Evento[];

	@OneToMany(() => Attendance, (attendance: Attendance) => attendance.lab)
	attendances: Attendance[];
}
