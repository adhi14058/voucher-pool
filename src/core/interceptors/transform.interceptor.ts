import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import * as classTransformer from 'class-transformer';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor {
  constructor(
    private readonly classType: classTransformer.ClassConstructor<T>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data: unknown) => {
        if (Array.isArray(data)) {
          return classTransformer.plainToInstance(this.classType, data, {
            excludeExtraneousValues: true,
          });
        }
        return classTransformer.plainToInstance(this.classType, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
