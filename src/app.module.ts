import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule } from "@nestjs/config"
import { PrismaModule } from './database/prisma.module';
@Module({
    imports : [ConfigModule.forRoot({isGlobal: true}), PrismaModule, UsersModule, OrdersModule],
})
export class AppModule{}