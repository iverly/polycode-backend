import { Injectable, NotFoundException } from '@nestjs/common';
import { Exercise, ExerciseDocument } from '../models/exercise.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { to500 } from '@polycode/to';

@Injectable()
export class ExerciseProviderService {
  constructor(
    @InjectModel(Exercise.name)
    private exerciseModel: Model<ExerciseDocument>
  ) {}

  /**
   * It returns a single exercise from the database, based on the conditions passed to it
   * @param conditions - Record<string, unknown>
   * @returns A promise of an exercise
   */
  async getOne(conditions: Record<string, unknown>): Promise<Exercise> {
    const exercise = await to500<Exercise>(
      this.exerciseModel.findOne({ ...conditions }).exec()
    );

    if (!exercise) {
      throw new NotFoundException();
    }

    return exercise;
  }

  /**
   * It returns a promise that resolves to an array of exercises
   * @returns An array of exercises
   */
  async getAll() {
    const exercises = await to500<Exercise[]>(this.exerciseModel.find().exec());
    return exercises;
  }

  /**
   * It returns a promise that resolves to an exercise
   * @param {string} id - string - the id of the exercise we want to get
   * @returns The exercise with the given id.
   */
  async getById(id: string): Promise<Exercise> {
    const exercise = await this.getOne({ id });
    return exercise;
  }
}
