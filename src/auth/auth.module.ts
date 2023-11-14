import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {JwtModule} from "@nestjs/jwt";
import {jwtConstants} from "./constants";
import {PassportModule} from "@nestjs/passport";
import {UserModule} from "../user/user.module";
import {VisitorModule} from "../visitor/visitor.module";
import {JwtStrategy} from "./jwt.strategy";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
    imports: [
        UserModule,
        VisitorModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            global: true,
            useFactory: async (configureService: ConfigService) => ({
                secret: configureService.get<string>('jwt.secret'),
                signOptions: {expiresIn: '6h'}
            }),
            inject: [ConfigService]
        }),
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {
}
