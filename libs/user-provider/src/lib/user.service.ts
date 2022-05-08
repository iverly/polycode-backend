import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { to500 } from '@polycode/to';
import { User } from './models/User';
import { UserCreateDto } from './dtos/user.dto';
import { EventService } from '@polycode/event';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { v4 as uuidv4 } from 'uuid';
import Redis from 'ioredis';
import { SubmissionConsumerService } from '@polycode/submission-consumer';
import { ChallengeConsumerService } from '@polycode/challenge-consumer';
import { OnEvent } from '@nestjs/event-emitter';
import { AuthConsumerService } from '@polycode/auth-consumer';

@Injectable()
export class UserProviderService {
  private readonly logger = new Logger(UserProviderService.name);

  constructor(
    private readonly eventService: EventService,
    @InjectRedis()
    private readonly redis: Redis,
    private readonly submissionConsumerService: SubmissionConsumerService,
    private readonly challengeConsumerService: ChallengeConsumerService,
    private readonly authConsumerService: AuthConsumerService
  ) {}

  /**
   * It returns a promise that resolves to a user object if the user exists in the database, or null if
   * the user doesn't exist
   * @param conditions - Record<string, unknown>
   * @returns A promise of a user
   */
  async findOne(conditions: Record<string, unknown>): Promise<User> {
    try {
      return await User.findOne({
        where: conditions,
      });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  /**
   * It returns a promise of an array of users that match the conditions passed in
   * @param conditions - Record<string, unknown>
   * @returns An array of users
   */
  async findAll(conditions: Record<string, unknown>): Promise<User[]> {
    const users = await to500<User[]>(
      User.findAll({
        where: conditions,
      })
    );

    return users;
  }

  /**
   * It returns a promise that resolves to a user object
   * @param {string} id - string - the id of the user we want to find
   * @returns The user with the id that was passed in.
   */
  async findById(id: string): Promise<User> {
    const user = await to500<User>(this.findOne({ id }));

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  /**
   * It creates a new user in the database
   * @param {User} user - User - The user object that we want to create.
   * @returns A promise of a user
   */
  async create(userCreateDto: UserCreateDto): Promise<User> {
    const userCreated = await to500<User>(
      User.create({
        ...userCreateDto,
      })
    );

    await this.authConsumerService.createSubjectAsUser(
      userCreated.id,
      userCreateDto.email,
      userCreateDto.password
    );

    this.eventService.emit('user.created', {
      ...userCreated.toJSON(),
    });

    return userCreated;
  }

  /**
   * Update a user's data.
   * @param {User | string} user - User | string
   * @param data - Record<string, unknown>
   * @returns A promise that resolves to void.
   */
  async update(
    user: User | string,
    data: Record<string, unknown>
  ): Promise<void> {
    if (typeof user === 'string') {
      user = await this.findById(user);
    }
    await to500(user.update(data));
    return;
  }

  /**
   * It creates a unique token, stores it in Redis, and returns it
   * @param {User} user - User - The user object that we want to create a token for.
   * @returns A string
   */
  async createVerifyEmailToken(user: User): Promise<string> {
    try {
      const token = uuidv4();
      await this.redis.hset('user_verify_email_token', token, user.id);

      return token;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  /**
   * It takes a token, looks up the user ID in Redis, and then updates the user's isEmailVerified field
   * to true
   * @param {string} token - string - The token that was sent to the user's email address.
   * @returns A promise that resolves to void.
   */
  async verifyEmailToken(token: string): Promise<void> {
    const userId = await to500<string>(
      this.redis.hget('user_verify_email_token', token)
    );

    if (!userId) {
      throw new NotFoundException('Token not found');
    }

    await this.update(userId, {
      isEmailVerified: true,
    });

    await to500(this.redis.hdel('user_verify_email_token', token));
    return;
  }

  /**
   * It's getting all the submissions of a user, then it's getting all the exercises that the user has
   * submitted to, then it's grouping the exercises by module and course and then it's returning the
   * grouped exercises
   * @param {string} id - The id of the user.
   * @returns An array of objects.
   */
  async getUserSubmissions(id: string): Promise<Record<string, string>[]> {
    const submissions = await this.submissionConsumerService.getUserSubmissions(
      id
    );

    const uniqueExerciseIds = new Set(
      submissions.map((submission) => submission.targetId)
    );

    const exercises = await Promise.all(
      [...uniqueExerciseIds].map((id) =>
        this.challengeConsumerService.getExerciseById(id)
      )
    );

    const response = [];

    /* Pushing the exercises that don't have a module into the response array. */
    response.push(
      ...exercises
        .filter((exercise) => !exercise.module)
        .map((exercise) => {
          return {
            id: exercise.id,
            name: exercise.name,
            description: exercise.description,
            submissions: submissions
              .filter((submission) => submission.targetId === exercise.id)
              .map((submission) => ({
                id: submission.id,
                at: submission.at,
                execution: submission.execution,
              })),
            type: 'exercise',
          };
        })
    );

    /* It's filtering out the exercises that don't have a course but a module and then it's getting the unique module ids. */
    const exercisesWithModuleAndNoCourse = exercises.filter(
      (exercise) => exercise.module && !exercise.module.course
    );
    const uniqueModuleIds = new Set(
      exercisesWithModuleAndNoCourse.map((exercise) => exercise.module.id)
    );

    /* It's pushing the modules that don't have a course into the response array. */
    response.push(
      ...[...uniqueModuleIds].map((moduleId) => {
        const module = exercisesWithModuleAndNoCourse.find(
          (exercise) => exercise.module.id === moduleId
        )?.module;

        const exercises = exercisesWithModuleAndNoCourse.filter(
          (exercise) => exercise.module.id === moduleId
        );

        return {
          id: module.id,
          name: module.name,
          description: module.description,
          exercises: exercises.map((exercise) => ({
            id: exercise.id,
            name: exercise.name,
            description: exercise.description,
            submissions: submissions
              .filter((submission) => submission.targetId === exercise.id)
              .map((submission) => ({
                id: submission.id,
                at: submission.at,
                execution: submission.execution,
              })),
            type: 'exercise',
          })),
          type: 'module',
        };
      })
    );

    /* It's filtering out the exercises that have a module and a course and then it's getting the
    unique course ids. */
    const exercisesWithModuleAndCourse = exercises.filter(
      (exercise) => exercise.module && exercise.module.course
    );
    const uniqueCourseIds = new Set(
      exercisesWithModuleAndCourse.map((exercise) => exercise.module.course.id)
    );

    /* It's pushing the courses into the response array. */
    response.push(
      ...[...uniqueCourseIds].map((courseId) => {
        const course = exercisesWithModuleAndCourse.find(
          (exercise) => exercise.module.course.id === courseId
        )?.module.course;

        const modules = exercisesWithModuleAndCourse
          .filter((exercise) => exercise.module.course.id === courseId)
          .map((exercise) => exercise.module);

        return {
          id: course.id,
          name: course.name,
          description: course.description,
          modules: modules.map((module) => {
            const exercises = exercisesWithModuleAndCourse.filter(
              (exercise) => exercise.module.id === module.id
            );

            return {
              id: module.id,
              name: module.name,
              description: module.description,
              exercises: exercises.map((exercise) => ({
                id: exercise.id,
                name: exercise.name,
                description: exercise.description,
                submissions: submissions
                  .filter((submission) => submission.targetId === exercise.id)
                  .map((submission) => ({
                    id: submission.id,
                    at: submission.at,
                    execution: submission.execution,
                  })),
                type: 'exercise',
              })),
              type: 'module',
            };
          }),
          type: 'course',
        };
      })
    );

    return response;
  }

  /**
   * When a user is created, create a verify email token and emit an event with the user and token
   * @param {User} user - User - The user that was created
   */
  @OnEvent('user.created')
  async onUserCreated(user: User): Promise<void> {
    this.eventService.emit('user.verify_email.token.created', {
      user,
      token: await this.createVerifyEmailToken(user),
    });
  }
}
