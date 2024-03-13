import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {SessionEntity} from "./session.entity";
import {In, Repository, UpdateResult} from "typeorm";
import {CreateSessionDto} from "./dto/create-session.dto";
import {RelationsSessionDto} from "./dto/relations-session.dto";
import {UpdateSessionDto} from "./dto/update-session.dto";
import {RequestUser} from "../common/intefaces/request-user";
import {Role} from "../auth/enum/role.enum";

@Injectable()
export class SessionService {
    constructor(
        @InjectRepository(SessionEntity) private sessionRepository: Repository<SessionEntity>
    ) {
    }

    async create(
        sessionDto: CreateSessionDto,
        requestUser: RequestUser,
    ): Promise<SessionEntity> {
        if (requestUser.id !== sessionDto.userId) throw new UnauthorizedException();
        const createdSession: SessionEntity = this.sessionRepository.create(sessionDto);
        const savedSession = await this.sessionRepository.save(createdSession);
        return await this.sessionRepository.findOne({
            where: {
                id: savedSession.id
            },
            relations: {
                user: {
                    lab: true
                }
            },
        })
    }

    async notExistByUserIdOrFail(userId: number) {
        const sessions = await this.sessionRepository.createQueryBuilder('session')
            .where('DATE_TRUNC(\'day\', session.createdAt) = :today', {today: new Date().toISOString().split('T')[0]})
            .andWhere('session.user_id = :userId', {userId})
            .getCount();
        if (sessions > 0) throw new Error();
    }

    async findOneById(id: number, relations: RelationsSessionDto): Promise<SessionEntity> {
        return await this.sessionRepository.findOne({
            where: {id},
            relations,
        })
    }

    async findOneByUserId(userId: number, requestUser: RequestUser): Promise<SessionEntity> {
        if (requestUser.role !== Role.ADMIN && requestUser.id !== userId) throw new UnauthorizedException();
        return await this.sessionRepository.findOne({
            where: {
                userId,
                status: true,
            },
            relations: {
                user: {
                    lab: true,
                }
            },
        })
    }

    async findAllByUserId(userId: number, requestUser: RequestUser): Promise<SessionEntity[]> {
        if (requestUser.role !== Role.ADMIN && requestUser.id !== userId) throw new UnauthorizedException();
        return await this.sessionRepository.find({
            where: {
                userId,
            },
            relations: {
                user: {
                    lab: true,
                }
            },
        })
    }

    async findOneByCheckCode(checkCode: string, relations: RelationsSessionDto): Promise<SessionEntity> {
        return await this.sessionRepository.findOne({
            where: {checkCode},
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
                status: true,
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

    async findAll(relations: RelationsSessionDto, requestUser: RequestUser): Promise<SessionEntity[]> {
        return await this.sessionRepository.find({
            relations: {
                user: relations.user ? { lab: true } : false
            },
            where: requestUser.role === Role.ADMIN ? {} : {userId: requestUser.id},
        })
    }

    async update(id: number, sessionDto: UpdateSessionDto): Promise<UpdateResult> {
        return await this.sessionRepository.update({id}, sessionDto);
    }

    async closeSession(id: number, requestUser?: RequestUser): Promise<UpdateResult> {
        if (requestUser) {
            const {userId} = await this.findOneById(id, {})
            if (requestUser.role !== Role.ADMIN && requestUser.id !== userId) throw new UnauthorizedException();
        }
        return await this.sessionRepository.update({id}, {
            status: false,
        });
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
