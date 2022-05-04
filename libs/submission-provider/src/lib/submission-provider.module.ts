import { Module } from '@nestjs/common';
import { SubmissionProviderController } from './submission-provider.controller';
import { SubmissionProviderService } from './submission-provider.service';
import { ChallengeConsumerModule } from '@polycode/challenge-consumer';
import { RunnerConsumerModule } from '@polycode/runner-consumer';

@Module({
  imports: [ChallengeConsumerModule, RunnerConsumerModule],
  controllers: [SubmissionProviderController],
  providers: [SubmissionProviderService],
  exports: [SubmissionProviderService],
})
export class SubmissionProviderModule {}
