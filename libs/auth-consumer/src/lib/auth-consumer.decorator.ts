import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { SubjectType } from './types/subject.type';
import { AuthorizationGuard, SubjectTypeGuard } from './auth-consumer.guard';
import { AUTH_CONSUMER_DECORATOR_SUBJECT_TYPES } from './auth-consumer.constants';
import { IRolePolicies } from './interfaces';
import { SetPolicies } from '@polycode/casl';
import { PolicyGuard } from '@polycode/casl';

export interface AuthorizeDecoratorOptions {
  subject?: {
    types: SubjectType[];
  };
  policies?: IRolePolicies;
}

export function Authorize(options: AuthorizeDecoratorOptions = {}) {
  return applyDecorators(
    SetMetadata(
      AUTH_CONSUMER_DECORATOR_SUBJECT_TYPES,
      options.subject?.types || []
    ),
    SetPolicies(...(options.policies || [])),
    UseGuards(AuthorizationGuard, SubjectTypeGuard, PolicyGuard)
  );
}
