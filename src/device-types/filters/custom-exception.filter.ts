// import {
//   HttpStatus,
//   ArgumentsHost,
//   ExceptionFilter,
//   ConflictException,
//   NotFoundException,
//   ForbiddenException,
//   UnauthorizedException,
//   UnprocessableEntityException,
//   BadRequestException,
// } from '@nestjs/common';
// import { Response } from 'express';

// export class CustomExceptionFilter implements ExceptionFilter {
//   catch(exception: any, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     let status = exception.getStatus();
//     let msg = exception.message;

//     if (exception instanceof ConflictException) {
//       status = HttpStatus.CONFLICT;
//       msg = 'ID  already exists!';
//     } else if (exception instanceof UnprocessableEntityException) {
//       status = HttpStatus.UNPROCESSABLE_ENTITY;
//       msg = 'Validation problem.';
//     } else if (exception instanceof UnauthorizedException) {
//       status = HttpStatus.UNAUTHORIZED;
//       msg = 'Device type not logged in!';
//     } else if (exception instanceof ForbiddenException) {
//       status = HttpStatus.FORBIDDEN;
//       msg = 'Access forbidden for this device types.';
//     } else if (exception instanceof NotFoundException) {
//       status = HttpStatus.NOT_FOUND;
//       msg = 'Device types not found.';
//     } else if (exception instanceof BadRequestException) {
//       status = HttpStatus.CONFLICT;
//       msg = 'Validation problem';
//     }

//     response.status(status).json({
//       statusCode: status,
//       msg: msg,
//     });
//   }
// }
