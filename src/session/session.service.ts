import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {SessionEntity} from "./session.entity";
import {In, Repository, UpdateResult} from "typeorm";
import {CreateSessionDto} from "./dto/create-session.dto";
import {RelationsSessionDto} from "./dto/relations-session.dto";
import {UpdateSessionDto} from "./dto/update-session.dto";

@Injectable()
export class SessionService {
    constructor(
        @InjectRepository(SessionEntity) private sessionRepository: Repository<SessionEntity>
    ) {
    }

    async create(sessionDto: CreateSessionDto): Promise<SessionEntity> {
        const createdSession: SessionEntity = this.sessionRepository.create(sessionDto);
        return this.sessionRepository.save(createdSession);
    }

    async findOneById(id: number, relations: RelationsSessionDto): Promise<SessionEntity> {
        return await this.sessionRepository.findOne({
            where: {id},
            relations: {
                ...relations,
                user: {
                    lab: {
                        events: true
                    }
                }
            },
            select: {
                id: true,
                entry: true,
                userId: true,
                user: {
                    id: true,
                    account: {
                      firstName: true,
                      lastName: true,
                    },
                    lab: {
                        id: true,
                        suneduCode: true,
                        events: {
                            id: true,
                            title: true,
                        }
                    }
                }
            }
        })
    }

    async findAll(relations: RelationsSessionDto): Promise<SessionEntity[]> {
        return await this.sessionRepository.find({
            relations,
        })
    }

    async update(id: number, sessionDto: UpdateSessionDto): Promise<UpdateResult> {
        return await this.sessionRepository.update({id}, sessionDto);
    }

    async delete(id: number): Promise<UpdateResult> {
        return await this.sessionRepository.softDelete({id});
    }

    async findOneOrFail(id: number) {
        return await this.sessionRepository.findOneOrFail({where: {id}});
    }

    async findAllOrFail(ids: number[]) {
        const sessions: SessionEntity[] = await this.sessionRepository.findBy({id: In(ids)});
        if (sessions.length === 0) throw new Error();
        if (sessions.some((session: SessionEntity) => !ids.includes(session.id))) throw new Error();
    }
}
