import { Module } from '@nestjs/common';
import { UserProviderController } from './user.controller';
import { UserProviderService } from './user.service';
import { AuthConsumerModule } from '@polycode/auth-consumer';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeModels } from './models';
import { EventModule } from '@polycode/event';
import { EventConsumerModule } from '@polycode/event-consumer';
import { NotificationConsumerModule } from '@polycode/notification-consumer';
import { SubmissionConsumerModule } from '@polycode/submission-consumer';
import { ChallengeConsumerModule } from '@polycode/challenge-consumer';

@Module({
  imports: [
    AuthConsumerModule,
    SequelizeModule.forFeature(sequelizeModels),
    EventModule,
    EventConsumerModule.register({ prefix: 'user' }),
    NotificationConsumerModule,
    SubmissionConsumerModule,
    ChallengeConsumerModule,
  ],
  controllers: [UserProviderController],
  providers: [UserProviderService],
  exports: [UserProviderService],
})
export class UserProviderModule {}
