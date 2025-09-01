import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Counter } from 'prom-client';
import { Request, Response } from 'express';

@Injectable()
export class PrometheusInterceptor implements NestInterceptor {
  private readonly customHttpRequestsTotal = new Counter({
    name: 'http_requests_total_custom',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'path', 'status'],
  });

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const response: Response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      tap(() => {
        this.customHttpRequestsTotal.inc({
          method: request.method,
          path: request.path,
          status: response.statusCode,
        });
      }),
    );
  }
}
