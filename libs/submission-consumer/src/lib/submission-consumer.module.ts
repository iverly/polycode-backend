import { Module } from '@nestjs/common';
import { SubmissionConsumerService } from './submission-consumer.service';
import { SubmissionProviderModule } from '@polycode/submission-provider';

@Module({
  imports: [SubmissionProviderModule],
  controllers: [],
  providers: [SubmissionConsumerService],
  exports: [SubmissionConsumerService],
})
export class SubmissionConsumerModule {}
