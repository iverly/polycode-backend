import { applyDecorators, SetMetadata } from '@nestjs/common';
import { CASL_DECORATOR_POLICIES } from './casl.constants';
import { PolicyHandler } from './casl.types';

export const SetPoliciesHandler = (...handlers: PolicyHandler[]) =>
  applyDecorators(SetMetadata(CASL_DECORATOR_POLICIES, handlers));
