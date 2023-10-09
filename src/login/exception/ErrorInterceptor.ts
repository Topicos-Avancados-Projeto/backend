import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    UnauthorizedException,
    ForbiddenException
  } from '@nestjs/common';
  import { Observable, throwError } from 'rxjs';
  import { catchError } from 'rxjs/operators';
  
  @Injectable()
  export class ErrorInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next
        .handle()
        .pipe(
          catchError(err => {
            if (err instanceof UnauthorizedException) {
              // Altere a mensagem de erro para 401 aqui
              throw new UnauthorizedException('Sua mensagem personalizada para erro 401 aqui');
            }
            if (err instanceof ForbiddenException) {
              // Altere a mensagem de erro para 403 aqui
              throw new ForbiddenException('Sua mensagem personalizada para erro 403 aqui');
            }
            return throwError(err);
          }),
        );
    }
  }