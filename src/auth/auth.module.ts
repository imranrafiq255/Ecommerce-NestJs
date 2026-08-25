import { Module } from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./auth.service";
import { PasswordService } from "./password/password.service";
import { AuthRepository } from "./repositories/auth.repository";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { PassportModule } from "@nestjs/passport";

@Module({
    imports : [
        // 1. ADD PASSPORTMODULE HERE SO NESTJS CAN TRACK IT
        PassportModule.register({ defaultStrategy: 'jwt' }), 
        
        JwtModule.registerAsync({
          inject : [ConfigService],
          useFactory : (configService: ConfigService) => ({
              secret : configService.getOrThrow<string>("jwt.jwtSecret"), 
              signOptions : {expiresIn : configService.getOrThrow("jwt.jwtAccessTokenExpiresIn")}
          })
        })
    ],
    controllers : [AuthController],
    providers : [AuthService, PasswordService, AuthRepository, JwtStrategy],
    // 2. NOW IT IS SAFE TO EXPORT BOTH
    exports : [PassportModule, JwtModule] 
})
export class AuthModule{} 
