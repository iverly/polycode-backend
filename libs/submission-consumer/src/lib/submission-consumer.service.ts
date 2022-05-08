import { Injectable } from '@nestjs/common';
import { WorkloadResult } from '@polycode/runner';
import { SubmissionProviderService } from '@polycode/submission-provider';

export enum SubmissionType {
  EXERCISE = 'exercise',
}

export interface ISubmission {
  id: string;
  userId: string;
  type: SubmissionType;
  targetId: string;
  at: Date;
  execution?: WorkloadResult;
}

@Injectable()
export class SubmissionConsumerService {
  constructor(
    private readonly submissionProviderService: SubmissionProviderService
  ) {}

  /**
   * This function returns a promise of an array of ISubmission objects
   * @param {string} userId - The userId of the user whose submissions you want to retrieve.
   * @returns An array of ISubmission objects.
   */
  getUserSubmissions(userId: string): Promise<ISubmission[]> {
    return this.submissionProviderService.getUserSubmissions(userId);
  }
}
