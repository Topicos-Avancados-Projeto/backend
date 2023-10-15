import {
  HttpStatus,
  ArgumentsHost,
  ExceptionFilter,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';

export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = exception.getStatus();
    let msg = exception.message;

    if (exception instanceof ConflictException) {
      status = HttpStatus.CONFLICT;
      msg = 'Broker Client Already exists!';
    } else if (exception instanceof UnprocessableEntityException) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      msg = 'Syntax Error!';
    } else if (exception instanceof UnauthorizedException) {
      status = HttpStatus.UNAUTHORIZED;
      msg = 'Broker Client is not logged in!';
    } else if (exception instanceof ForbiddenException) {
      status = HttpStatus.FORBIDDEN;
      msg = 'Broker Client do not have permission!';
    } else if (exception instanceof NotFoundException) {
      status = HttpStatus.NOT_FOUND;
      msg = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      msg: msg,
    });
  }
}
