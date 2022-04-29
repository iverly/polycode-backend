import { Controller, Get } from '@nestjs/common';
import { Authorize, SubjectType } from '@polycode/auth-consumer';
import { Action } from '@polycode/casl';
import { Sequelize } from 'sequelize-typescript';

@Controller()
export class AppController {
  // constructor(private sequelize: Sequelize) {
  //   this.sequelize.sync();
  // }

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
