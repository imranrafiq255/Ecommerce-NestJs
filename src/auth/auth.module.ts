import { Module } from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./auth.service";
import { PasswordService } from "./password/password.service";
import { AuthRepository } from "./repositories/auth.repository";

@Module({
    controllers : [AuthController],
    providers : [AuthService, PasswordService, AuthRepository]
})
export class AuthModule{}