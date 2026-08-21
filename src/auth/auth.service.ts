import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AuthRepository } from "./repositories/auth.repository";
import { PasswordService } from "./password/password.service";
import { Prisma } from "../generated/prisma/client";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService{
    constructor(private readonly authRepository: AuthRepository, private readonly passwordService: PasswordService, private readonly jwtService: JwtService){}
    async register(data: {name:string, email:string, password:string}){
        try{
            const hashedPassword = await this.passwordService.hash(data.password);
            return await this.authRepository.register({name: data.name, email: data.email, password: hashedPassword});
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
        try{
        const user = await this.authRepository.login(data.email);
        if (!user){
            return new NotFoundException("Invalid email");
        }
        const comparedPassword = await this.passwordService.verify(user.password, data.password);
        if (!comparedPassword){
            return new UnauthorizedException("Incorrect password");
        }
        const payload = {
            sub : user.id,
            name: user.name
        }
        const accessToken = await this.jwtService.signAsync(payload);
        return {
            accessToken,
            tokenType : "Bearer"
        }
    }
     catch(error){
        if (error instanceof Prisma.PrismaClientKnownRequestError){
            if(error.code === "P2025"){
                return new NotFoundException("Invalid email")
            }
            throw error;
        }
     }
    }
};