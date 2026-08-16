import { Injectable } from "@nestjs/common"
import {OrdersRepository} from "../repositories/orders.repository"
@Injectable()
export class OrdersService{
    constructor(private readonly ordersRepository: OrdersRepository){}
    getOrders(){
        return [{id : 1, product : "Laptop", quantity : 2}, {id : 2, product : "Phone", quantity : 5}];
    }
    createOrder(order: any){
        return order;
    }
}