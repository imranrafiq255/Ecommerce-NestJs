import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class AuthRepository{
    constructor(private readonly prisma: PrismaService){}
    async register(data: {name: string, email:string, password:string}){
        return this.prisma.user.create({data});
    }
    async login(email: string){
        return await this.prisma.user.findFirstOrThrow({
            where : {
                email
            }
        })
    }
}