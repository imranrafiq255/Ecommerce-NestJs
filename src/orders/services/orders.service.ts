import { Injectable } from "@nestjs/common"
import {OrdersRepository} from "../repositories/orders.repository"
@Injectable()
export class OrdersService{
    constructor(private readonly ordersRepository: OrdersRepository){}
    async getOrders(){
        return this.ordersRepository.getOrders();
    }
    createOrder(order: {name: string, quantity: number, productId: number, userId: number}){
        return this.ordersRepository.createOrder(order);
    }
}