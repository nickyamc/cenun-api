import {Column} from 'typeorm';

export class Account {
    @Column({length: 8, unique: true})
    dni: string;

    @Column({length: 100, unique: true})
    email: string;

    @Column({length: 15, unique: true})
    username: string;

    @Column({type: 'text', select: false})
    password: string;

    @Column({name: 'first_name'})
    firstName: string;

    @Column({name: 'last_name'})
    lastName: string;

    @Column({length: 12, nullable: true})
    phone: string;
}
