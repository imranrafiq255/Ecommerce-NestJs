import { Body, Controller, Get, Post, UseInterceptors, ClassSerializerInterceptor, UseGuards, Req } from "@nestjs/common";
import { OrdersService } from "../services/orders.service"
import { CreateOrderDto } from "../dtos/order-request.dto";
import { plainToInstance } from "class-transformer";
import { OrdersResponseDto } from "../dtos/order-response.dto";
import { Throttle } from "@nestjs/throttler";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Role } from "../../auth/enums/enum.role";
import { Roles } from "../../auth/decorators/roles.decorator";
import * as ExpressTypes from "../interfaces/request-with-user.interface";
@Controller('orders')
@UseInterceptors(ClassSerializerInterceptor)
export class OrdersController{
    constructor(private readonly ordersService: OrdersService){}
    @Throttle({default : {limit : 3, ttl : 10000}}) // for specific endpoint
    @UseGuards(JwtAuthGuard)
    @Get()
async getOrders() {
    const orders = await this.ordersService.getOrders();
    const sanitizedOrders = orders.map(order => ({
        ...order,
        product: order.product ? {
            ...order.product,
            price: order.product.price ? Number(order.product.price.toString()) : 0
        } : null
    }));

    return plainToInstance(OrdersResponseDto, sanitizedOrders, { excludeExtraneousValues: true });
}
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Post()
    createOrder(@Req() req:ExpressTypes.RequestWithUser, @Body() order: CreateOrderDto){
        const userId = req.user.userId;
        const data = {...order, userId};
        return this.ordersService.createOrder(data);
    }
}