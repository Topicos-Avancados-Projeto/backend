import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ConflictException,
  UnprocessableEntityException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(
  ConflictException,
  UnprocessableEntityException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = exception.getStatus();
    let msg = exception.message;

    if (exception instanceof ConflictException) {
      status = HttpStatus.CONFLICT;
      msg = 'Broker Client already exists!';
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
