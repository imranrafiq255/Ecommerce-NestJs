import {Injectable} from "@nestjs/common"
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class OrdersRepository{
    constructor(private readonly prisma: PrismaService){}
    async getOrders(){
        return this.prisma.order.findMany({
            include : {
                orderBy : {
                    select : {
                        name : true,
                        email : true
                    }
                }
            },
        });
    }
    async createOrder(data){
        return this.prisma.order.create({
            data
        })
    }
}