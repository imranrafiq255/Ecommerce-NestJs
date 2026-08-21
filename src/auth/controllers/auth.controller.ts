import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { RegisterRequestDto } from "../dtos/register-request.dto";
import { plainToInstance } from "class-transformer";
import { RegisterResponseDto } from "../dtos/register-response.dto";
import { LoginRequestDto } from "../dtos/login-request.dto";
import { LoginResponseDto } from "../dtos/login-response.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import * as AuthTypes from "../interfaces/request-with-user.interface";
// 1. IMPORT REQUEST FROM EXPRESS

@Controller("auth")
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post("register")
    async register(@Body() data: RegisterRequestDto) {
        const user = await this.authService.register(data);
        return plainToInstance(RegisterResponseDto, user);
    }

    @Post("login")
    // 2. ADD ASYNC/AWAIT TO RESOLVE THE LOGIN PROMISE
    async login(@Body() data: LoginRequestDto) {
        return this.authService.login(data);
    }

    @UseGuards(JwtAuthGuard)
    @Get("me")
    // 3. EXPLICITLY TYPE THE REQUEST OBJECT
    getCurrentUser(@Req() request: AuthTypes.RequestWithUser) {
        return request.user;
    }
}
