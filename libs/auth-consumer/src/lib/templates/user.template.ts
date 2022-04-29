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
        id: '@Param::id',
      },
    },
  ],
};
