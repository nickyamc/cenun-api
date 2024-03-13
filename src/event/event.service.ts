import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Evento} from './event.entity';
import {In, Repository, UpdateResult} from 'typeorm';
import {CreateEventDto} from './dto/create-event.dto';
import {UpdateEventDto} from './dto/update-event.dto';
import {RelationsEventDto} from './dto/relations-event.dto';
import e from 'express';

@Injectable()
export class EventService {
    constructor(
        @InjectRepository(Evento) private eventRepository: Repository<Evento>,
    ) {
    }

    async findAll(relations: RelationsEventDto): Promise<Evento[]> {
        return await this.eventRepository.find({
            relations,
        });

    }

    async findAllByIds(ids: number[]): Promise<Evento[]> {
        return await this.eventRepository.findBy({
            id: In(ids),
        });
    }

    async findOneById(id: number, relations: RelationsEventDto): Promise<Evento> {
        return await this.eventRepository.findOne({
            where: {id},
            relations,
        });
    }

    async findAllOrFail(ids: number[]) {
        const events: Evento[] = await this.eventRepository.findBy({id: In(ids)});
        if (events.length === 0) throw new Error();
        if (events.some((event: Evento) => !ids.includes(event.id))) throw new Error();
    }

    async findOneOrFail(id: number) {
        return await this.eventRepository.findOneOrFail({where: {id}});
    }

    async create(event: CreateEventDto): Promise<Evento> {
        const createdEvent: Evento = this.eventRepository.create(event);
        return this.eventRepository.save(createdEvent);
    }

    async update(id: number, event: UpdateEventDto): Promise<UpdateResult> {
        return this.eventRepository.update({id}, event);
    }

    async delete(id: number): Promise<UpdateResult> {
        return await this.eventRepository.softDelete({id});
    }

    async count(): Promise<number> {
        return await this.eventRepository.count()
    }
}
