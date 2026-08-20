import { Body, ClassSerializerInterceptor, Controller, HttpCode, Post, UseInterceptors } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { RegisterRequestDto } from "../dtos/register-request.dto";
import { plainToInstance } from "class-transformer";
import { RegisterResponseDto } from "../dtos/register-response.dto";
import { LoginRequestDto } from "../dtos/login-request.dto";
import { LoginResponseDto } from "../dtos/login-response.dto";

@Controller("auth")
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController{
    constructor(private readonly authService: AuthService){}
    @Post("register")
    async register(@Body() data: RegisterRequestDto){
        const user = await this.authService.register(data);
        return plainToInstance(RegisterResponseDto, user);
    }
    @Post("login")
    @HttpCode(200)
    async login(@Body() data: LoginRequestDto){
        const user = this.authService.login(data);
        return plainToInstance(LoginResponseDto, user);
    }
}