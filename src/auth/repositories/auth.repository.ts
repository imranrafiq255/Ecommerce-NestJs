import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import {User} from "../../generated/prisma/client"
import { Role } from "../enums/enum.role";
@Injectable()
export class AuthRepository{
    constructor(private readonly prisma: PrismaService){}
    async register(data: {name: string, email:string, password:string,role:Role}){
        return this.prisma.user.create({data});
    }
    async login(email: string) : Promise <User | null> {
        return await this.prisma.user.findFirstOrThrow({
            where : {
                email
            }
        })
    }
    async deleteUser(id: number){
        return await this.prisma.user.delete({
            where : {id}
        })
    }
}