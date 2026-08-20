import {Injectable} from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class UsersRepository{
    constructor(private readonly prisma: PrismaService){}
    async findAll(){
        return this.prisma.user.findMany();
    }
    async create(data: {email : string, name: string, password: string}){
        return this.prisma.user.create({
            data
        });
    }
}