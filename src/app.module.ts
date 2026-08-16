import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule } from "@nestjs/config"
@Module({
    imports : [ConfigModule.forRoot({isGlobal: true}), UsersModule, OrdersModule],
})
export class AppModule{}