import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { validate } from 'uuid';

@Injectable()
export class ParseUUIDOrMePipe implements PipeTransform {
  private paramName: string;

  constructor(paramName = 'id') {
    this.paramName = paramName;
  }

  transform(request: Request) {
    const id = request.params[this.paramName];

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
