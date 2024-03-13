import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evento } from './event.entity';
import { IsEventExistConstraint } from './validation/is-event-exist.validation';

@Module({
	imports: [TypeOrmModule.forFeature([Evento])],
	providers: [EventService, IsEventExistConstraint],
	controllers: [EventController],
	exports: [EventService],
})
export class EventModule {}
