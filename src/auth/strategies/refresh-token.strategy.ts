import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    configService: ConfigService,
    private authService: AuthService,
  ) {
    const refreshTokenKey = configService.getOrThrow<string>('jwt.jwtRefreshSecret')
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refreshToken || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: refreshTokenKey,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.cookies?.refreshToken;
    const userId = payload.sub;
    const sessionId = payload.sid;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }
    const user = await this.authService.validateRefreshToken(sessionId, refreshToken, userId);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    return {userId: payload.sub,
            name: payload.name,
            role: payload.role,
            sid: payload.sid
  }
}}
