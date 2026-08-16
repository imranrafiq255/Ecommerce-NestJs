import { Body, Controller, Get, Post } from "@nestjs/common";
import { OrdersService } from "../services/orders.service"
import { CreateOrderDto } from "../dtos/createOrder.dto";
@Controller('orders')
export class OrdersController{
    constructor(private readonly ordersService: OrdersService){}
    @Get()
    getOrders(){
        return this.ordersService.getOrders();
    }
    @Post()
    createOrder(@Body() order: CreateOrderDto){
        return this.ordersService.createOrder(order);
    }
}