import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ApiResponse } from '../response/api-response';

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

    // TODO: 자주 사용하는 에러 코드 추가
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2000':
          response
            .status(HttpStatus.BAD_REQUEST)
            .json(ApiResponse.fail(HttpStatus.BAD_REQUEST, message));
          break;
        case 'P2002':
          response
            .status(HttpStatus.CONFLICT)
            .json(ApiResponse.fail(HttpStatus.CONFLICT, message));
          break;
        case 'P2025':
          response
            .status(HttpStatus.NOT_FOUND)
            .json(ApiResponse.fail(HttpStatus.NOT_FOUND, message));
          break;
        default:
          response
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(
              ApiResponse.fail(
                HttpStatus.INTERNAL_SERVER_ERROR,
                `${exception.code} : ${message}`,
              ),
            );
      }
    } else {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.fail(HttpStatus.INTERNAL_SERVER_ERROR, message));
    }
  }
}
