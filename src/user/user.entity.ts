import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {UserRole} from './enums';
import {DateRecord} from 'src/entities/dateRecord.entity';
import {Account} from 'src/entities/account.entity';
import {Lab} from 'src/lab/lab.entity';
import {SessionEntity} from "../session/session.entity";

@Entity({name: 'user'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column(() => Account, {prefix: false})
    account: Account;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.EMPLOYEE,
    })
    role: UserRole;

    @Column({name: 'job_title'})
    jobTitle: string;

    @Column()
    denomination: string;

    @Column({nullable: true})
    birthdate: Date;

    @Column({name: 'lab_id', nullable: true})
    labId: number;

    @Column({name: 'is_active', default: false})
    isActive: boolean;

    @Column(() => DateRecord, {prefix: false})
    dateRecord: DateRecord;

    @OneToMany(() => SessionEntity, (session: SessionEntity) => session.user)
    sessions: SessionEntity[];

    @ManyToOne(() => Lab, (lab) => lab.users)
    @JoinColumn({name: 'lab_id'})
    lab: Lab;
}
