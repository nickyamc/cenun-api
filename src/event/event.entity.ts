import { Attendance } from 'src/attendance/attendance.entity';
import { Visitor } from 'src/visitor/visitor.entity';
import { DateRecord } from 'src/entities/dateRecord.entity';
import { Lab } from 'src/lab/lab.entity';
import {
	Column,
	Entity,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'event' })
export class Evento {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column({ type: 'text' })
	description: string;

	@Column()
	location: string;

	@Column(() => DateRecord, { prefix: false })
	dateRecord: DateRecord;

	@ManyToMany(() => Lab, (lab) => lab.events)
	labs: Lab[];

	@ManyToMany(() => Visitor, (customer) => customer.events)
	visitors: Visitor[];

	@OneToMany(() => Attendance, (attendance) => attendance.event)
	attendances: Attendance[];
}
