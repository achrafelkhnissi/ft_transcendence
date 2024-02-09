import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { PrismaError } from 'src/common/enums/PrismaError';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter<T> extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/"/g, '');
    const cause = exception.meta.cause;

    switch (exception.code) {
      case PrismaError.UniqueConstraintViolation: {
        const status = HttpStatus.CONFLICT;
        response.status(status).json({
          statusCode: status,
          message: cause,
        });
        break;
      }
      case PrismaError.RecordDoesNotExist: {
        const status = HttpStatus.NOT_FOUND;
        response.status(status).json({
          statusCode: status,
          message: cause,
        });
        break;
      }
      default:
        super.catch(exception, host);
        break;
    }
  }
}
