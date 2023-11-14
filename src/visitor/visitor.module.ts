import {Module} from '@nestjs/common';
import {VisitorService} from './visitor.service';
import {VisitorController} from './visitor.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Visitor} from './visitor.entity';
import {EventModule} from "../event/event.module";
import {IsVisitorExistConstraints} from "./validation/is-visitor-exist.validation";

@Module({
    imports: [TypeOrmModule.forFeature([Visitor]), EventModule],
    providers: [VisitorService, IsVisitorExistConstraints],
    controllers: [VisitorController],
    exports: [VisitorService]
})
export class VisitorModule {
}
