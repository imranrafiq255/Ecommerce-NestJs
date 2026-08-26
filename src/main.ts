import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config';
import helmet from "helmet";
import { NestExpressApplication } from '@nestjs/platform-express';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import cookieParser from "cookie-parser";
async function bootstrap() {
  // NestExpressApplication configured for app.set
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Security Header Checks
  app.use(helmet());
  app.use(cookieParser())
  // Cors
  app.enableCors({
    origin : ["http://localhost:3000"],
    credentials : true
  })
  // Pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist : true,
    forbidNonWhitelisted : true,
    transform : true
  }))
  // Api endpoint prefix
  app.setGlobalPrefix('api');
  app.set('trust proxy', 1);
  app.useGlobalFilters(
    new PrismaExceptionFilter()
  )
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('app.port') ?? 3000);
}
bootstrap();
