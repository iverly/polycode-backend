import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { SubjectType } from './types/subject.type';
import { AuthorizationGuard, SubjectTypeGuard } from './auth-consumer.guard';
import { AUTH_CONSUMER_DECORATOR_SUBJECT_TYPES } from './auth-consumer.constants';
import { IRolePolicies } from './interfaces';
import { SetPoliciesHandler, SubjectAbility } from '@polycode/casl';
import { subject } from '@casl/ability';
import { Request } from 'express';
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
    SetPoliciesHandler(
      ...(options.policies?.map(
        (policy) => (ability: SubjectAbility, request: Request) => {
          for (const attribute of Object.keys(policy.attributes || {})) {
            if (typeof policy.attributes[attribute] !== 'string') {
              continue;
            }

            /* Replacing the policy attributes from templates. */
            const attr: string = policy.attributes[attribute] as string;

            if (attr.startsWith('@Param::')) {
              const paramName = attr.replace('@Param::', '');
              policy.attributes[attribute] = request.params[paramName];
            }

            if (attr.startsWith('@Query::')) {
              const paramName = attr.replace('@Query::', '');
              policy.attributes[attribute] = request.query[paramName];
            }

            if (attr.startsWith('@Header::')) {
              const paramName = attr.replace('@Header::', '');
              policy.attributes[attribute] = request.headers[paramName];
            }

            if (attr.startsWith('@Body::')) {
              const paramName = attr.replace('@Body::', '');
              policy.attributes[attribute] = request.body[paramName];
            }
          }

          return ability.can(
            policy.action,
            subject(policy.resource, { ...policy.attributes })
          );
        }
      ) || [])
    ),
    UseGuards(AuthorizationGuard, SubjectTypeGuard, PolicyGuard)
  );
}
