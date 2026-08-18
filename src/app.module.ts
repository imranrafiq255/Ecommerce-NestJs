import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule } from "@nestjs/config"
import { PrismaModule } from './database/prisma.module';
import configConfiguration from './config/config.configuration';
import { schemaValidation } from './config/config.validation';
@Module({
    imports : [ConfigModule.forRoot({isGlobal: true, load : [configConfiguration], validationSchema : schemaValidation}), PrismaModule, UsersModule, OrdersModule],
})
export class AppModule{}