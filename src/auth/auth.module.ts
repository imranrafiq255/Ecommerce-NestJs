import { Module } from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./auth.service";
import { PasswordService } from "./password/password.service";
import { AuthRepository } from "./repositories/auth.repository";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { SessionsRepository } from "./repositories/sessions.repository";
import { JwtRefreshTokenStrategy } from "./strategies/refresh-token.strategy";

@Module({
    imports : [
        PassportModule.register({ defaultStrategy: 'jwt' }), 
        JwtModule.registerAsync({
          inject : [ConfigService],
          useFactory : (configService: ConfigService) => ({
              secret : configService.getOrThrow<string>("jwt.jwtAccessSecret"), 
              signOptions : {expiresIn : configService.getOrThrow("jwt.jwtAccessTokenExpiresIn")}
          })
        })
    ],
    controllers : [AuthController],
    providers : [AuthService, PasswordService, AuthRepository, JwtStrategy, SessionsRepository, JwtRefreshTokenStrategy],
    exports : [PassportModule, JwtModule] 
})
export class AuthModule{} 
