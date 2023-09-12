import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
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
    let message: string;
    let status: number;

    message = exception.message.replace(/\n/g, '');
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
          const code = exception.code;
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          message = `${code} : ${exception.message.replace(/\n/g, '')}`;
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response.status(status).json({
      message,
    });
  }
}
