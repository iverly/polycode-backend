import { Injectable } from '@nestjs/common';
import { ChallengeConsumerService } from '@polycode/challenge-consumer';
import { ExerciseSubmissionDto } from './dtos/exercise.dto';
import { RunnerConsumerService } from '@polycode/runner-consumer';
import { Language } from '@polycode/runner';

@Injectable()
export class SubmissionProviderService {
  constructor(
    private readonly challengeConsumerService: ChallengeConsumerService,
    private readonly runnerConsumerService: RunnerConsumerService
  ) {}

  async submitExercise(exerciseSubmissionDto: ExerciseSubmissionDto) {
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

    return runResponse.data;
  }
}
