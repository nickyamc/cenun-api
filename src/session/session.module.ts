import {Module} from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {SessionEntity} from "./session.entity";
import {NotExistSessionByUserIdValidatorConstraint} from "./validator/not-exist-session-by-user-id.validator";

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  providers: [
      SessionService,
      NotExistSessionByUserIdValidatorConstraint,
  ],
  controllers: [SessionController],
  exports: [SessionService]
})
export class SessionModule {}
