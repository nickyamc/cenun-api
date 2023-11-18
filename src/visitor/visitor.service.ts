import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Visitor} from './visitor.entity';
import {In, Repository, UpdateResult} from 'typeorm';
import {CreateVisitorDto} from './dto/create-visitor.dto';
import {UpdateVisitorDto} from './dto/update-visitor.dto';
import {RelationsVisitorDto} from './dto/relations-visitor.dto';
import {Evento} from 'src/event/event.entity';
import {hash} from 'bcrypt';
import {EventService} from "../event/event.service";

@Injectable()
export class VisitorService {
    constructor(
        @InjectRepository(Visitor)
        private visitorRepository: Repository<Visitor>,
        private eventService: EventService
    ) {
    }

    async login(email: string, username: string): Promise<Visitor> {
        return await this.visitorRepository.findOne({
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
                    password: true
                },
                type: true,
            }
        })
    }

    async create(visitor: CreateVisitorDto): Promise<Visitor> {
        visitor = {
            ...visitor,
            account: {
                ...visitor.account,
                password: await hash(visitor.account.password, 10),
            },
        }
        const createdVisitor: Visitor = this.visitorRepository.create(visitor);
        createdVisitor.events = await this.eventService.findAllByIds(visitor.eventIds);
        return this.visitorRepository.save(createdVisitor);
    }

    async findAll(relations: RelationsVisitorDto): Promise<Visitor[]> {
        return await this.visitorRepository.find({
            relations,
        });
    }

    async findOneById(
        id: number,
        relations: RelationsVisitorDto,
    ): Promise<Visitor | null> {
        return await this.visitorRepository.findOne({
            where: {id},
            relations,
        });
    }

    async findOneOrFail(id: number): Promise<Visitor> {
        return await this.visitorRepository.findOneOrFail({where: {id}})
    }

    async findAllOrFail(ids: number[]) {
        const visitors = await this.visitorRepository.findBy({id: In(ids)});
        if (visitors.length === 0) throw new Error();
        if (visitors.some((visitor: Visitor) => !ids.includes(visitor.id))) throw new Error();
    }

    async update(id: number, visitor: UpdateVisitorDto): Promise<UpdateResult> {
        return this.visitorRepository.update({id}, visitor);
    }

    async delete(id: number): Promise<UpdateResult> {
        return await this.visitorRepository.softDelete({id});
    }
}
