import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto} from './dto/create-user.dto';
import {RelationsUserDto} from './dto/relations-user.dto';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {UpdateUserDto} from './dto/update-user.dto';
import {Auth} from "../auth/decorator/auth.decorator";
import {Role} from "../auth/enum/role.enum";
import {GetRequestUser} from "../common/decorators/GetRequestUser.decorator";
import {RequestUser} from "../common/intefaces/request-user";
import {IdentifyUserDto} from "./dto/identify-user.dto";
import {ApiQueriesByRelations} from "../common/decorators/ApiQueriesByRelations.decorator";
import {ApiRequestByIdAndRelations} from "../common/decorators/ApiRequestByIdAndRelations.decorator";
import {ApiParamById} from "../common/decorators/ApiParamById.decorator";
import {ApiBodyTemplate} from "../common/decorators/ApiBodyTemplate.decorator";
import {ApiRequestByBodyAndId} from "../common/decorators/ApiRequestByBodyAndId.decorator";

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {
    }

    @ApiBodyTemplate('user', CreateUserDto)
    // @Auth(Role.ADMIN)
    @Post()
    create(@Body() user: CreateUserDto) {
        return this.userService.create(user);
    }

    @ApiQueriesByRelations('lab')
    @Auth(Role.ADMIN)
    @Get()
    findAll(
        @Query() relations: RelationsUserDto,
    ) {
        return this.userService.findAll(relations);
    }

    @ApiRequestByIdAndRelations('user', ['lab', 'sessions'])
    @Auth(Role.EMPLOYEE)
    @Get(':id')
    findOneById(
        @Param() identify: IdentifyUserDto,
        @Query() query: RelationsUserDto,
        @GetRequestUser() requestUser: RequestUser
    ) {
        return this.userService.findOneById(identify.id, query, requestUser);
    }

    @ApiRequestByBodyAndId('user', UpdateUserDto, true)
    @Auth(Role.EMPLOYEE)
    @Patch(':id')
    update(
        @Param() identify: IdentifyUserDto,
        @Body() user: UpdateUserDto,
        @GetRequestUser() requestUser: RequestUser
    ) {
        return this.userService.update(identify.id, user, requestUser);
    }

    @ApiParamById('user')
    @Auth(Role.EMPLOYEE)
    @Delete(':id')
    delete(
        @Param() identify: IdentifyUserDto,
        @GetRequestUser() requestUser: RequestUser
    ) {
        return this.userService.delete(identify.id, requestUser);
    }
}
