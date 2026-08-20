import { Body, Controller, Get, Post, UseInterceptors, ClassSerializerInterceptor } from "@nestjs/common";
import { OrdersService } from "../services/orders.service"
import { CreateOrderDto } from "../dtos/order-request.dto";
import { plainToInstance } from "class-transformer";
import { OrdersResponseDto } from "../dtos/order-response.dto";
import { Throttle } from "@nestjs/throttler";
@Controller('orders')
@UseInterceptors(ClassSerializerInterceptor)
export class OrdersController{
    constructor(private readonly ordersService: OrdersService){}
    @Throttle({default : {limit : 3, ttl : 10000}}) // for specific endpoint
    @Get()
    async getOrders(){
        const orders = this.ordersService.getOrders();
        return plainToInstance(OrdersResponseDto, orders, {excludeExtraneousValues : true} );
    }
    @Post()
    createOrder(@Body() order: CreateOrderDto){
        return this.ordersService.createOrder(order);
    }
}