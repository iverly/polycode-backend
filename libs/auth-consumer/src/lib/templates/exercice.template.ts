import { Action } from '@polycode/casl';
import { AuthorizeDecoratorOptions } from '../auth-consumer.decorator';
import { SubjectType } from '../types';

export const ExerciseReadAuthorize: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Read,
      resource: 'exercise',
    },
  ],
};
