import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {LoginAuthDto} from "./dto/login-auth.dto";
import {ApiBody, ApiTags} from "@nestjs/swagger";
import {RegisterUserAuthDto} from "./dto/register-user-auth.dto";
import {RegisterVisitorAuthDto} from "./dto/register-visitor-auth.dto";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiBody({
        type: LoginAuthDto,
        required: true,
    })
    @Post('login/user')
    loginUser(@Body() login: LoginAuthDto) {
        return this.authService.signInUser(login);
    }

    @ApiBody({
        type: LoginAuthDto,
        required: true,
    })
    @Post('login/visitor')
    loginVisitor(@Body() login: LoginAuthDto) {
        return this.authService.signInVisitor(login);
    }

    @ApiBody({
        type: RegisterVisitorAuthDto,
        required: true,
    })
    @Post('register/visitor')
    registerUser(@Body() registerVisitor: RegisterVisitorAuthDto) {
        return this.authService.signUpVisitor(registerVisitor);
    }
}
