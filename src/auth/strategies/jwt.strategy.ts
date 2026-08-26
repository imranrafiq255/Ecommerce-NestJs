import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Role } from "../enums/enum.role";
import { SessionsRepository } from "../repositories/sessions.repository"; // 1. IMPORT REPOSITORY

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private readonly sessionsRepository: SessionsRepository // 2. INJECT REPOSITORY
    ) {
        const secretKey = configService.getOrThrow<string>("jwt.jwtAccessSecret");
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, 
            secretOrKey: secretKey
        });
    }

    async validate(payload: { sub: string, name: string, role: Role, sid: string }) {
        // 3. CHECK IF THE ACCESS TOKEN'S SESSION IS REVOKED OR EXPIRED
        const session = await this.sessionsRepository.findById(payload.sid);
        
        if (!session || session.revokedAt || session.expiresAt < new Date()) {
            throw new UnauthorizedException('Your session has been revoked or expired.');
        }
        
        return {
            userId: payload.sub,
            name: payload.name,
            role: payload.role,
            sid: payload.sid
        }; 
    }
}
