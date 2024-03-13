import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Lab} from './lab.entity';
import {In, Repository, UpdateResult} from 'typeorm';
import {CreateLabDto} from './dto/create-lab.dto';
import {UpdateLabDto} from './dto/update-lab.dto';
import {EventService} from 'src/event/event.service';
import {RelationsLabDto} from './dto/relations-lab.dto';
import {RequestUser} from "../common/intefaces/request-user";
import {Role} from "../auth/enum/role.enum";

@Injectable()
export class LabService {
    constructor(
        @InjectRepository(Lab) private labRepository: Repository<Lab>,
        private eventService: EventService,
    ) {
    }

    async findAll(relations: RelationsLabDto): Promise<Lab[]> {
        return await this.labRepository.find({
            relations: {
                ...relations,
            },
        });
    }

    async findOneById(id: number, relations: RelationsLabDto, requestUser: RequestUser): Promise<Lab> {
        const lab: Lab = await this.labRepository.findOne({
            where: {id},
            relations: {...relations},
        });
        this.validateOwnership(lab.userIds, requestUser);
        return lab;
    }

    async notFindByCodeOrFail(suneduCode: string) {
        const lab: Lab = await this.labRepository.findOne({
            where: {suneduCode},
        });
        if (lab) throw new Error();
    }

    async findOneOrFail(id: number) {
        return await this.labRepository.findOneOrFail({where: {id}});
    }

    async findAllOrFail(ids: number[]) {
        const labs = await this.labRepository.findBy({id: In(ids)});
        if (labs.length === 0) throw new Error();
        if (labs.some((lab: Lab) => !ids.includes(lab.id))) throw new Error();
    }

    async create(lab: CreateLabDto): Promise<Lab> {
        const createdLab: Lab = this.labRepository.create(lab);
        createdLab.events = await this.eventService.findAllByIds(lab.eventIds);
        return this.labRepository.save(createdLab);
    }

    async update(id: number, lab: UpdateLabDto): Promise<UpdateResult> {
        return await this.labRepository.update({id}, lab);
    }

    async delete(id: number): Promise<UpdateResult> {
        return await this.labRepository.softDelete({id});
    }

    private validateOwnership(ids: number[], requestUser: RequestUser) {
        if (requestUser.role !== Role.ADMIN && !ids.includes(requestUser.id)) {
            throw new UnauthorizedException();
        }
    }

    async count(): Promise<number> {
        return await this.labRepository.count()
    }
}
