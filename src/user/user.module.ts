import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import {IsUserExistConstraint} from "./validation/is-user-exist.validation";

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [UserService, IsUserExistConstraint],
	controllers: [UserController],
	exports: [UserService]
})
export class UserModule {}
