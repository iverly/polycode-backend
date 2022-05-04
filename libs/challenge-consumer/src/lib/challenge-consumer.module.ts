import { Module } from '@nestjs/common';
import { ChallengeProviderModule } from '@polycode/challenge-provider';
import { ChallengeConsumerService } from './challenge-consumer.service';

@Module({
  imports: [ChallengeProviderModule],
  controllers: [],
  providers: [ChallengeConsumerService],
  exports: [ChallengeConsumerService],
})
export class ChallengeConsumerModule {}
