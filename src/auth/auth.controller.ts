import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {LoginAuthDto} from "./dto/login-auth.dto";
import {ApiBody, ApiTags} from "@nestjs/swagger";

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
        return this.authService.sigInUser(login)
    }

    @Post('login/visitor')
    loginVisitor(@Body() auth: LoginAuthDto) {
        console.log({})
    }
}
