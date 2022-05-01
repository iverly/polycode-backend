import { Injectable } from '@nestjs/common';
import { NotificationConsumerService } from '@polycode/notification-consumer';
import { EmailTemplate } from '@polycode/notification-consumer';

@Injectable()
export class UserEventsService {
  constructor(
    private readonly notificationConsumerService: NotificationConsumerService
  ) {}

  /**
   * "When a new user is created, send them a welcome email."
   *
   * The function is called `handleNewUser` and it takes a single argument, `user`. The argument is a
   * `Record<string, unknown>`, which is a TypeScript type that represents an object with any number of
   * properties, where the value of each property is of type `unknown`
   * @param user - Record<string, unknown>
   */
  handleNewUser(user: Record<string, unknown>) {
    // send email to the new user
    this.notificationConsumerService.sendTemplatedEmail(
      `${user.email}`,
      EmailTemplate.USER_WELCOME,
      {
        username: user.username,
      }
    );
  }
}
