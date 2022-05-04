import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { to500 } from '@polycode/to';
import { Course, CourseDocument } from '../models/course.model';

@Injectable()
export class CourseProviderService {
  constructor(
    @InjectModel(Course.name)
    private courseModel: Model<CourseDocument>
  ) {}

  /**
   * It returns a course document, and if the course document doesn't exist, it throws a
   * NotFoundException
   * @param conditions - Record<string, unknown>
   * @param [populate=true] - boolean - whether or not to populate the course with its modules and
   * exercises.
   * @returns A course document
   */
  async getOne(
    conditions: Record<string, unknown>,
    populate = true
  ): Promise<CourseDocument> {
    const query = this.courseModel.findOne({ ...conditions });

    if (populate) {
      query.populate('modules');
      query.populate({ path: 'modules', populate: { path: 'exercises' } });
      query.populate('exercises');
    }

    const course = await to500<CourseDocument>(query.exec());
    if (!course) {
      throw new NotFoundException();
    }

    return course;
  }

  /**
   * It returns a promise that resolves to an array of CourseDocument objects
   * @param [populate=true] - boolean - If true, the query will populate the modules and exercises
   * fields.
   * @returns An array of CourseDocument objects.
   */
  async getAll(populate = true): Promise<CourseDocument[]> {
    const query = this.courseModel.find();

    if (populate) {
      query.populate('modules');
      query.populate({ path: 'modules', populate: { path: 'exercises' } });
      query.populate('exercises');
    }

    const courses = await to500<CourseDocument[]>(query.exec());
    return courses;
  }

  /**
   * It returns a promise that resolves to a CourseDocument
   * @param {string} id - string - the id of the course we want to get
   * @returns A course document
   */
  async getById(id: string): Promise<CourseDocument> {
    const course = await this.getOne({ id });
    return course;
  }
}
