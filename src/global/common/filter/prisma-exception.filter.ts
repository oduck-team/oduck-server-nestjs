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

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          status = HttpStatus.CONFLICT;
          message = `Duplicate Key Value : ${exception.meta!.target}`;
          break;
        case 'P2003':
          status = HttpStatus.BAD_REQUEST;
          message = `Invalid Input Data : ${exception.meta!.target}`;
          break;
        case 'P2014':
          status = HttpStatus.BAD_REQUEST;
          message = `Invalid ID : ${exception.meta!.target}`;
          break;
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = `Required Record Not Found : ${exception.meta!.target}`;
          break;
        default:
          const code = exception.code;
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          message = `${code} : ${exception.message.replace(/\n/g, '')}`;
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message.replace(/\n/g, '');
    }
    response.status(status).json(message);
  }
}
