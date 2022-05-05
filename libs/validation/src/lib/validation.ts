import {
  Injectable,
  PipeTransform,
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { validate } from 'uuid';

export const ReqDec = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request;
  }
);

@Injectable()
export class ParseUUIDOrMePipe implements PipeTransform {
  transform(request: Request) {
    const { id } = request.params;

    if (!id || (id !== '@me' && !validate(id))) {
      throw new BadRequestException();
    }

    if (id === '@me') {
      if (!request.authorization?.subject?.internalIdentifier) {
        throw new BadRequestException();
      }

      return request.authorization?.subject?.internalIdentifier;
    }

    return id;
  }
}
