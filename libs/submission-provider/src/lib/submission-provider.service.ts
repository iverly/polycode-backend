import { Injectable } from '@nestjs/common';
import { ChallengeConsumerService } from '@polycode/challenge-consumer';
import { ExerciseSubmissionDto } from './dtos/exercise.dto';
import { RunnerConsumerService } from '@polycode/runner-consumer';
import { v4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import {
  Submission,
  SubmissionDocument,
  SubmissionType,
} from './models/submission.model';
import { Model } from 'mongoose';
import { to500 } from '@polycode/to';

@Injectable()
export class SubmissionProviderService {
  constructor(
    private readonly challengeConsumerService: ChallengeConsumerService,
    private readonly runnerConsumerService: RunnerConsumerService,
    @InjectModel(Submission.name)
    private submissionModel: Model<SubmissionDocument>
  ) {}

  /**
   * Get all submissions for a user.
   * @param {string} userId - string
   * @returns An array of SubmissionDocument objects.
   */
  async getUserSubmissions(userId: string): Promise<SubmissionDocument[]> {
    const query = this.submissionModel.find({ userId }).sort({ at: -1 });
    return await to500<SubmissionDocument[]>(query.exec());
  }

  /**
   * It takes a submission, runs it, and saves the result
   * @param {ExerciseSubmissionDto} exerciseSubmissionDto - This is the data that the user is
   * submitting.
   * @param {string} userId - The id of the user who submitted the exercise.
   * @returns {
   *     id: submission.id,
   *     execution: {
   *       success: runResponse.data?.success,
   *       output: {
   *         stdout: runResponse.data?.output?.stdout,
   *         stderr: runResponse.data?.output?.stderr,
   *       },
   *     },
   *   }
   */
  async submitExercise(
    exerciseSubmissionDto: ExerciseSubmissionDto,
    userId: string
  ) {
    const exercise = await this.challengeConsumerService.getExerciseById(
      exerciseSubmissionDto.exerciseId
    );

    const runResponse = await this.runnerConsumerService.run({
      id: exercise.id,
      source: exerciseSubmissionDto.source,
      compilerOptions: {
        language: exercise.language,
        version: 'latest',
      },
    });

    const submission = new this.submissionModel({
      id: v4(),
      type: SubmissionType.EXERCISE,
      targetId: exercise.id,
      userId,
      at: new Date(),
      execution: {
        success: runResponse.data?.success,
        output: {
          stdout: runResponse.data?.output?.stdout,
          stderr: runResponse.data?.output?.stderr,
        },
      },
    });
    await to500(submission.save());

    return {
      id: submission.id,
      execution: {
        success: runResponse.data?.success,
        output: {
          stdout: runResponse.data?.output?.stdout,
          stderr: runResponse.data?.output?.stderr,
        },
      },
    };
  }
}
