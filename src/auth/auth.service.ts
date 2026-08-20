import { ConflictException, Injectable } from "@nestjs/common";
import { AuthRepository } from "./repositories/auth.repository";
import { PasswordService } from "./password/password.service";
import { Prisma } from "../generated/prisma/client";

@Injectable()
export class AuthService{
    constructor(private readonly authRepository: AuthRepository, private readonly passwordService: PasswordService){}
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
};