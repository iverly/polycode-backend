import { Module } from '@nestjs/common';
import { SubmissionProviderController } from './submission-provider.controller';
import { SubmissionProviderService } from './submission-provider.service';
import { ChallengeConsumerModule } from '@polycode/challenge-consumer';
import { RunnerConsumerModule } from '@polycode/runner-consumer';
import { AuthConsumerModule } from '@polycode/auth-consumer';
import { MongooseModule } from '@nestjs/mongoose';
import { Submission, SubmissionSchema } from './models/submission.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Submission.name, schema: SubmissionSchema },
    ]),
    ChallengeConsumerModule,
    RunnerConsumerModule,
    AuthConsumerModule,
  ],
  controllers: [SubmissionProviderController],
  providers: [SubmissionProviderService],
  exports: [SubmissionProviderService],
})
export class SubmissionProviderModule {}
