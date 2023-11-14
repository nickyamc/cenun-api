import {Module} from '@nestjs/common';
import {LabService} from './lab.service';
import {LabController} from './lab.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Lab} from './lab.entity';
import {IsLabExistConstraint} from './validation/is-lab-exist.validation';
import {IsDuplicateSuneduCodeConstraint} from './validation/is-duplicate-sunedu-code.validation';
import {EventModule} from "../event/event.module";

@Module({
    imports: [TypeOrmModule.forFeature([Lab]), EventModule],
    providers: [
        LabService,
        IsLabExistConstraint,
        IsDuplicateSuneduCodeConstraint,
    ],
    controllers: [LabController],
    exports: [LabService]
})
export class LabModule {
}
