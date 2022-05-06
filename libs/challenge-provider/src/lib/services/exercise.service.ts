import { Injectable, NotFoundException } from '@nestjs/common';
import { Exercise, ExerciseDocument } from '../models/exercise.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { to500 } from '@polycode/to';
import { ModuleProviderService } from './module.service';
import { Language } from '@polycode/runner';
import { v4 } from 'uuid';

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
  async getOne(
    conditions: Record<string, unknown>,
    populate = true
  ): Promise<Exercise> {
    const query = this.exerciseModel.findOne({ ...conditions });

    if (populate) {
      query.populate('module');
      query.populate({ path: 'module', populate: { path: 'course' } });
      query.populate('course');
    }

    const exercise = await to500<Exercise>(query.exec());

    if (!exercise) {
      throw new NotFoundException();
    }

    return exercise;
  }

  /**
   * It returns a promise that resolves to an array of exercises
   * @returns An array of exercises
   */
  async getAll(populate = true): Promise<Exercise[]> {
    const query = this.exerciseModel.find();

    if (populate) {
      query.populate('module');
      query.populate({ path: 'module', populate: { path: 'course' } });
      query.populate('course');
    }

    const exercises = await to500<Exercise[]>(query.exec());

    return exercises;
  }

  /**
   * It returns a promise that resolves to an exercise
   * @param {string} id - string - the id of the exercise we want to get
   * @returns The exercise with the given id.
   */
  async getById(id: string, populate = true): Promise<Exercise> {
    const exercise = await this.getOne({ id }, populate);
    return exercise;
  }

  async create(exercise: Exercise): Promise<Exercise> {
    const createdExercise = new this.exerciseModel(exercise);
    return to500<Exercise>(createdExercise.save());
  }
}
