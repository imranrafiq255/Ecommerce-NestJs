import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class ProductsRepository{
    constructor(private readonly prisma: PrismaService){}
    async getProducts(){
        return await this.prisma.product.findMany();
    }
    async createProducts(data: {name: string, price: number}){
        return await this.prisma.product.create({
            data
        })
    }
    async deleteProduct(id:number){
        return await this.prisma.product.delete({
            where : {id}
        })
    }
    async updateProduct(id:number, data: {name?:string, price?: number}){
        return await this.prisma.product.update({
            where : {id},
            data
        })
    }
}