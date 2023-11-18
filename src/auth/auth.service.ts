import {HttpException, Injectable, UnauthorizedException} from '@nestjs/common';
import {LoginAuthDto} from "./dto/login-auth.dto";
import {compare} from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../user/user.service";
import {VisitorService} from "../visitor/visitor.service";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private visitorService: VisitorService,
        private jwtService: JwtService
    ) {
    }

    async sigInUser(login: LoginAuthDto) {
        const {email, username, password} = login;

        const user = await this.userService.login(email, username);

        if (!user) throw new HttpException('El usuario no existe', 404);

        const checkPassword = await compare(password, user.account.password);

        if (!checkPassword) throw new UnauthorizedException();

        const payload = {role: user.role, username: user.account.username, id: user.id}

        return {
            user,
            access_token: await this.jwtService.signAsync(payload)
        };
    }

    async sigInVisitor(login: LoginAuthDto) {
        const {email, username, password} = login;

        const visitor = await this.visitorService.login(email, username);

        if (!visitor) throw new HttpException('El visitante no existe', 404);

        const checkPassword = await compare(password, visitor.account.password);

        if (!checkPassword) throw new UnauthorizedException();

        const payload = {role: 'visitor', username: visitor.account.username, id: visitor.id}

        return {
            visitor,
            access_token: await this.jwtService.signAsync(payload)
        };
    }
}
