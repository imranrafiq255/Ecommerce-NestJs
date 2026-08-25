import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from "@nestjs/common";

import { Prisma } from "../../generated/prisma/client";

@Catch(
    Prisma.PrismaClientKnownRequestError,
    Prisma.PrismaClientUnknownRequestError,
    Prisma.PrismaClientValidationError,
)
export class PrismaExceptionFilter implements ExceptionFilter {
    catch(
        exception:
            | Prisma.PrismaClientKnownRequestError
            | Prisma.PrismaClientUnknownRequestError
            | Prisma.PrismaClientValidationError,
        host: ArgumentsHost,
    ) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = "Internal server error";

        if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            switch (exception.code) {
                case "P2002":
                    status = HttpStatus.CONFLICT;
                    message = "A record with this value already exists";
                    break;

                case "P2025":
                    status = HttpStatus.NOT_FOUND;
                    message = "Requested record was not found";
                    break;

                case "P2003":
                    status = HttpStatus.BAD_REQUEST;
                    message = "Foreign key constraint failed";
                    break;

                default:
                    status = HttpStatus.INTERNAL_SERVER_ERROR;
                    message = "Database operation failed";
            }
        }

        if (
            exception instanceof
            Prisma.PrismaClientValidationError
        ) {
            status = HttpStatus.BAD_REQUEST;
            message = "Invalid database query";
        }

        if (
            exception instanceof
            Prisma.PrismaClientUnknownRequestError
        ) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = "Database operation failed";
        }

        response.status(status).json({
            statusCode: status,
            message,
        });
    }
}