import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt"
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(configService: ConfigService){
        const secretKey = configService.getOrThrow<string>("jwt.jwtSecret");
        super({jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),ignoreExpiration : false, secretOrKey : secretKey})
    }
     async validate(payload: {sub : string}){
        return {
            userId : payload.sub
        }
     }
}