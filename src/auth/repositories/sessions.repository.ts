import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { Prisma } from "../../generated/prisma/client";

@Injectable()
export class SessionsRepository{
    constructor(private readonly prisma: PrismaService){}
    async create(data: Prisma.SessionCreateInput){
        return await this.prisma.session.create({
            data
        })
    }
    async findById(sessionId: string){
        return await this.prisma.session.findUnique({
            where : {id: sessionId}
        })
    }
    async revoke(id: string){
        return await this.prisma.session.update({
            where : {id},
            data : {revokedAt : new Date()}
        })
    }
    async revokeAllForUser(userId: number){
        return await this.prisma.session.updateMany({
            where : {
                userId,
                revokedAt : null
            },
            data : {
                revokedAt : new Date()
            }
        })
    } 
    async updateHash(sessionId, refreshTokenHash){
        await this.prisma.session.update({
            where : {id:sessionId},
            data : {refreshTokenHash}
        })
    }
}