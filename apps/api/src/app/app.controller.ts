import { Controller, Get } from '@nestjs/common';
import { Authorize, SubjectType } from '@polycode/auth-consumer';
import { Action } from '@polycode/casl';

@Controller()
export class AppController {
  @Get('/:id')
  @Authorize({
    subject: {
      types: [SubjectType.USER],
    },
    policies: [
      {
        action: Action.Read,
        resource: 'user',
        attributes: { id: '@Param::id' },
      },
    ],
  })
  do() {
    return 'Hello World!';
  }
}
