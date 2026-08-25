import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule, ConfigService } from "@nestjs/config"
import { PrismaModule } from './database/prisma.module';
import configConfiguration from './config/config.configuration';
import { schemaValidation } from './config/config.validation';
import {ThrottlerModule, ThrottlerGuard} from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
@Module({
    imports : [ConfigModule.forRoot({isGlobal: true, load : [configConfiguration], validationSchema : schemaValidation}), ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Fetch the string from your .env file
        const redisUrl = configService.get<string>('redis.url') || 'redis://localhost:6379';

        return {
          throttlers: [
            {
              ttl: 60000, // 1 minute
              limit: 100, // 100 requests globally
            },
          ],
          // Dynamically pass the environment variable to your Redis instance
          storage: new ThrottlerStorageRedisService(new Redis(redisUrl)),
        };
      },
    }), PrismaModule, UsersModule, OrdersModule, AuthModule, ProductsModule],
    providers : [{provide : APP_GUARD, useClass : ThrottlerGuard}],
})
export class AppModule{} 