import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientUnknownRequestError,
)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(
    exception:
      | Prisma.PrismaClientKnownRequestError
      | Prisma.PrismaClientUnknownRequestError,
    host: ArgumentsHost,
  ): void {
    const response = host.switchToHttp().getResponse();
    const message = exception.message.replace(/\n/g, '');
    let status: number;

    Logger.error(exception);
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          status = HttpStatus.CONFLICT;
          break;
        case 'P2003':
          status = HttpStatus.BAD_REQUEST;
          break;
        case 'P2014':
          status = HttpStatus.BAD_REQUEST;
          break;
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          break;
        default:
          status = HttpStatus.INTERNAL_SERVER_ERROR;
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response.status(status).json({
      message,
    });
  }
}
