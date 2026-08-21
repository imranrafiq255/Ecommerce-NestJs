import { Body, Controller, Get, Post, UseInterceptors, ClassSerializerInterceptor, UseGuards } from "@nestjs/common";
import { OrdersService } from "../services/orders.service"
import { CreateOrderDto } from "../dtos/order-request.dto";
import { plainToInstance } from "class-transformer";
import { OrdersResponseDto } from "../dtos/order-response.dto";
import { Throttle } from "@nestjs/throttler";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
@Controller('orders')
@UseInterceptors(ClassSerializerInterceptor)
export class OrdersController{
    constructor(private readonly ordersService: OrdersService){}
    @Throttle({default : {limit : 3, ttl : 10000}}) // for specific endpoint
    @UseGuards(JwtAuthGuard)
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