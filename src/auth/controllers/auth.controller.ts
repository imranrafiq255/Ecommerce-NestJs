import { Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpCode, Param, Post, Req, Res, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { RegisterRequestDto } from "../dtos/register-request.dto";
import { plainToInstance } from "class-transformer";
import { RegisterResponseDto } from "../dtos/register-response.dto";
import { LoginRequestDto } from "../dtos/login-request.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import * as AuthTypes from "../interfaces/request-with-user.interface";
import { Role } from "../enums/enum.role";
import { Roles } from "../decorators/roles.decorator";
import { LoginResponseDto } from "../dtos/login-response.dto";
import { RolesGuard } from "../guards/roles.guard";
import { JwtRefreshTokenGuard } from "../guards/jwt-refresh.guard";
import ms from "ms";
// Replace your old Express import with this namespace import:
import * as Express from 'express';
import { ConfigService } from "@nestjs/config";

// 1. IMPORT REQUEST FROM EXPRESS

@Controller("auth")
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly configService: ConfigService){}

    @Post("register")
    async register(@Body() data: RegisterRequestDto) {
        const user = await this.authService.register(data);
        return plainToInstance(RegisterResponseDto, user);
    }

    @Post("login")
    // 2. ADD ASYNC/AWAIT TO RESOLVE THE LOGIN PROMISE
    async login(@Body() data: LoginRequestDto, @Res({passthrough : true}) response: Express.Response) {
        const result =  await this.authService.login(data);
        const nodeEnv = this.configService.get<string>("app.nodeEnv");
        const age = this.configService.get<string>("jwt.jwtRefreshTokenExpiresIn");
        const maxAgeMs = ms(age as ms.StringValue)
        response.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure : nodeEnv === "production",
            sameSite : "lax",
            maxAge : maxAgeMs
        })
        return plainToInstance(RegisterResponseDto, result);
    }

    @UseGuards(JwtAuthGuard)
    @Get("me")
    // 3. EXPLICITLY TYPE THE REQUEST OBJECT
    getCurrentUser(@Req() request: AuthTypes.RequestWithUser) {
        return request.user;
    }
    @Delete(":id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async deleteUser(@Param("id") id: number){
        return plainToInstance(LoginResponseDto,this.authService.deleteUser(id));
    }
    @UseGuards(JwtRefreshTokenGuard)
    @Get("refresh")
    async refreshTokens(@Req() request: AuthTypes.RequestWithUser) {
        return this.authService.generateNewAccessTokens({ userId: request.user.userId, name: request.user.name,  role: request.user.role, sid: request.user.sid }); 
    }
    @UseGuards(JwtAuthGuard)
    @Get("logout")
    async logout(@Req() request: AuthTypes.RequestWithUser, @Res({passthrough:true}) response: Express.Response){
        response.clearCookie("refreshToken");
        return await this.authService.logout(request.user.sid);
    }
    @UseGuards(JwtAuthGuard)
    @Get("logout-from-all-devices")
    async logoutFromAllDevices(@Req() request: AuthTypes.RequestWithUser, @Res({passthrough:true}) response: Express.Response){
        response.clearCookie("refreshToken");
        return await this.authService.logoutFromAllDevices(request.user.userId);
    }
}
