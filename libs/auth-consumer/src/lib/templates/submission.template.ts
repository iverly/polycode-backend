import { Action } from '@polycode/casl';
import { AuthorizeDecoratorOptions } from '../auth-consumer.decorator';
import { SubjectType } from '../types';

export const UserSubmissionAuthorize: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Create,
      resource: 'submission',
    },
  ],
};

export const UserSubmissionReadAuthorize: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Read,
      resource: 'submission',
      attributes: {
        userId: '@Param::userId',
      },
    },
  ],
};
