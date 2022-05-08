import { Action } from '@polycode/casl';
import { AuthorizeDecoratorOptions } from '../auth-consumer.decorator';
import { SubjectType } from '../types';

export const UserReadSelfAuthorize: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Read,
      resource: 'user',
      attributes: {
        id: '@Param::userId',
      },
    },
  ],
};

export const UserReadWriteSelfAuthorize: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Read,
      resource: 'user',
      attributes: {
        id: '@Param::id',
      },
    },
    {
      action: Action.Update,
      resource: 'user',
      attributes: {
        id: '@Param::userId',
      },
    },
  ],
};
