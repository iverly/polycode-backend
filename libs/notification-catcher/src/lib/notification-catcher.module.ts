import { Module } from '@nestjs/common';
import { EventConsumerModule } from '@polycode/event-consumer';
import { UserEventsListener } from './listeners/user.listener';
import { UserEventsService } from './services/user.service';
import { NotificationConsumerModule } from '@polycode/notification-consumer';

@Module({
  imports: [
    EventConsumerModule.register({ prefix: 'user' }),
    NotificationConsumerModule,
  ],
  controllers: [],
  providers: [UserEventsListener, UserEventsService],
  exports: [],
})
export class NotificationCatcherModule {}
