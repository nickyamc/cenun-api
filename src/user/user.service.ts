import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from './user.entity';
import {In, Repository} from 'typeorm';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {RelationsUserDto} from './dto/relations-user.dto';
import {hash} from 'bcrypt';
import {RequestUser} from "../common/intefaces/request-user";
import {Role} from "../auth/enum/role.enum";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {
    }

    async login(email: string, username: string): Promise<User> {
        return await this.userRepository.findOne({
            where: [
                {
                    account: {
                        email
                    }
                },
                {
                    account: {
                        username
                    }
                }
            ],
            select: {
                id: true,
                account: {
                    username: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    password: true,
                },
                role: true,
            }
        })
    }

    findAll(relations: RelationsUserDto): Promise<User[]> {
        return this.userRepository.find({
            relations,
        });
    }

    async findOneById(id: number, relations: RelationsUserDto, requestUser: RequestUser): Promise<User | null> {
        const user = await this.userRepository.findOne({
            where: {id},
            relations,
        });
        this.validateOwnership(id, requestUser);
        return user;
    }

    async create(user: CreateUserDto): Promise<User> {
        user = {
            ...user,
            account: {
                ...user.account,
                password: await hash(user.account.password, 10),
            },
        }
        const createdUser: User = this.userRepository.create(user);
        return this.userRepository.save(createdUser);
    }

    async update(id: number, user: UpdateUserDto, requestUser: RequestUser) {
        this.validateOwnership(id, requestUser);
        return await this.userRepository.update({id}, user);

    }

    async delete(id: number, requestUser: RequestUser) {
        this.validateOwnership(id, requestUser);
        return await this.userRepository.softDelete({id});
    }

    private validateOwnership(id: number, requestUser: RequestUser) {
        if (requestUser.role !== Role.ADMIN && requestUser.id !== id) {
            throw new UnauthorizedException();
        }
    }

    async findOneOrFail(id: number) {
        return await this.userRepository.findOneOrFail({where: {id}});
    }

    async findAllOrFail(ids: number[]) {
        const users = await this.userRepository.findBy({id: In(ids)});
        if (users.length === 0) throw new Error();
        if (users.some((user) => !ids.includes(user.id))) throw new Error();
    }
}
