import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthTokenInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    /* const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    const match = authHeader?.match(/^\s*Bearer\s+(.+)\s*$/i);
    if (match) {
      const token = match[1];
      try {
        const payload = this.jwtService.verify(token);
        req.user = payload;
      } catch (err) {
        throw new UnauthorizedException('Invalid token'); 
      }
    } */
    return next.handle();
  }
}
