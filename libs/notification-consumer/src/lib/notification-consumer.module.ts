import { Module } from '@nestjs/common';
import { NotificationConsumerService } from './notification-consumer.service';
import { NotificationProviderModule } from '@polycode/notification-provider';

@Module({
  imports: [NotificationProviderModule],
  controllers: [],
  providers: [NotificationConsumerService],
  exports: [NotificationConsumerService],
})
export class NotificationConsumerModule {}
