import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_CONSUMER_DECORATOR_SUBJECT_TYPES } from './auth-consumer.constants';
import { AuthConsumerService } from './auth-consumer.service';
import { SubjectType } from './types/subject.type';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly authConsumerService: AuthConsumerService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const request = http.getRequest();
    const authorizationHeader = request.headers.authorization;

    const response = await this.authConsumerService.authorize(
      authorizationHeader
    );

    console.log('got an authorization route request');

    if (!response.subject) {
      return true;
    }

    const subjectTypes = this.reflector.get<SubjectType[]>(
      AUTH_CONSUMER_DECORATOR_SUBJECT_TYPES,
      context.getHandler()
    );

    if (!subjectTypes || !subjectTypes.length) {
      return true;
    }

    /* Checking if the subject type is in the array of subject types. */
    const subjectTypeIndex = subjectTypes.findIndex(
      (subjectType) => subjectType === response.subject.type
    );

    if (subjectTypeIndex === -1) {
      throw new ForbiddenException(
        `Forbidden access for subject type ${response.subject.type}.`
      );
    }

    return true;
  }
}
