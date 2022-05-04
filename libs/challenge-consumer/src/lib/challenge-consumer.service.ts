import { Injectable } from '@nestjs/common';
import { Exercise } from './types/exercise.type';
import { ExerciseProviderService } from '@polycode/challenge-provider';

@Injectable()
export class ChallengeConsumerService {
  constructor(
    private readonly exerciseProviderService: ExerciseProviderService
  ) {}

  /**
   * It returns a promise of an exercise
   * @param {string} id - The id of the exercise to get.
   * @returns A promise of an exercise.
   */
  async getExerciseById(id: string): Promise<Exercise> {
    const exercise = await this.exerciseProviderService.getById(id);
    return {
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      statement: exercise.statement,
      language: exercise.language,
      defaultSource: exercise.defaultSource,
    };
  }
}
