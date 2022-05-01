import { Module } from '@nestjs/common';
import { NotificationProviderService } from './notification-provider.service';
import { EmailSenderModule } from '@polycode/email-sender';

@Module({
  imports: [EmailSenderModule],
  controllers: [],
  providers: [NotificationProviderService],
  exports: [NotificationProviderService],
})
export class NotificationProviderModule {}
