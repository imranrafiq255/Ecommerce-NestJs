import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AuthRepository } from "./repositories/auth.repository";
import { PasswordService } from "./password/password.service";
import { Prisma } from "../generated/prisma/client";
import { JwtService } from "@nestjs/jwt";
import { Role } from "./enums/enum.role";
import { SessionsRepository } from "./repositories/sessions.repository";
import { ConfigService } from "@nestjs/config";
import ms from 'ms';
@Injectable()
export class AuthService{
    constructor(private readonly authRepository: AuthRepository, private readonly passwordService: PasswordService, private readonly jwtService: JwtService, private readonly sessionsRepository: SessionsRepository, private readonly configService:ConfigService){}
    async register(data: {name:string, email:string, password:string, role?:Role}){
        try{
            const hashedPassword = await this.passwordService.hash(data.password);
            return await this.authRepository.register({name: data.name, email: data.email, password: hashedPassword, role: data.role});
        }catch(error){
            if (error instanceof Prisma.PrismaClientKnownRequestError ){
                if (error.code === "P2002"){
                    throw new ConflictException("Email already exists");
                }
                throw error;
            }
        }
    }
    async login(data: {email:string, password:string}){
        try {
    const user = await this.authRepository.login(data.email);
    if (!user) {
      throw new NotFoundException("Invalid email");
    }

    const comparedPassword = await this.passwordService.verify(user.password, data.password);
    if (!comparedPassword) {
      throw new UnauthorizedException("Incorrect password");
    }

    const refreshDurationString = this.configService.getOrThrow<string>('jwt.jwtRefreshTokenExpiresIn');
    const expiresAt = new Date(Date.now() + ms(refreshDurationString as any));

    const initialSession = await this.sessionsRepository.create({
      refreshTokenHash: 'PENDING_HASH',
      expiresAt,
      user: {
        connect: { id: user.id }
      },
    });

    const payload = {
      sub: user.id,
      name: user.name,
      role: user.role,
      sid: initialSession.id
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('jwt.jwtAccessSecret'),
      expiresIn: this.configService.getOrThrow<any>('jwt.jwtAccessTokenExpiresIn'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('jwt.jwtRefreshSecret'),
      expiresIn : refreshDurationString as any,
    });

    const hashedRefreshToken = await this.passwordService.hash(refreshToken);
    await this.sessionsRepository.updateHash(initialSession.id, hashedRefreshToken);

    return {
      accessToken,
      refreshToken,
      tokenType: "Bearer"
    };

  }
     catch(error){
            throw error;
        }
    }
    async deleteUser(id: number){
         try{
            const user = await this.authRepository.deleteUser(id);
         if (!user){
            return new NotFoundException("User does not exist")
         }
         return user
         }catch(error){
            if (error instanceof Prisma.PrismaClientKnownRequestError){
                return new BadRequestException("Prisma error")
            }
         }
    }
    async validateRefreshToken(sessionId: string, refreshToken: string, userId: number) {
        console.log(sessionId, refreshToken, userId)
    const session = await this.sessionsRepository.findById(sessionId);
        if (!session){
            return null;
        }
        if (session.revokedAt){
            return null;
        }
        if(session.expiresAt < new Date()){
            return null;
        }
        const isValid = await this.passwordService.verify(session.refreshTokenHash, refreshToken);
        if (!isValid){
            return null;
        }
        const user = await this.authRepository.findById(userId);
        if (!user){
            return null;
        }
        return user;
    }
    async generateNewAccessTokens(userContext: { userId: number; name: string; role: any; sid: string }) {
  try {
    const payload = {
      sub: userContext.userId,
      name: userContext.name,
      role: userContext.role,
      sid: userContext.sid,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('jwt.jwtAccessSecret'),
      expiresIn: this.configService.getOrThrow<any>('jwt.jwtAccessTokenExpiresIn'),
    });

    return {
      accessToken,
      tokenType: "Bearer"
    };

  } catch (error) {
    throw error;
  }
    }
    async logout(sessionId: string){
        await this.sessionsRepository.revoke(sessionId);
        return {
            message : "You logged out successfully"
        }
    }
    async logoutFromAllDevices(userId){
        await this.sessionsRepository.revokeAllForUser(userId);
        return {
            message : "You logged out successfully"
        }
    }
};