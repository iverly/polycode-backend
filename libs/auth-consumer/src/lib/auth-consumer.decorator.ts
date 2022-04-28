import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { SubjectType } from './types/subject.type';
import { AuthorizationGuard } from './auth-consumer.guard';
import { AUTH_CONSUMER_DECORATOR_SUBJECT_TYPES } from './auth-consumer.constants';

export interface AuthorizeDecoratorOptions {
  subject?: {
    types: SubjectType[];
  };
}

export function Authorize(options: AuthorizeDecoratorOptions = {}) {
  return applyDecorators(
    SetMetadata(
      AUTH_CONSUMER_DECORATOR_SUBJECT_TYPES,
      options.subject?.types || []
    ),
    UseGuards(AuthorizationGuard)
  );
}
