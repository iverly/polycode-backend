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

@Injectable()
export class UserProviderService {
  private readonly logger = new Logger(UserProviderService.name);

  constructor(
    private readonly eventService: EventService,
    @InjectRedis() private readonly redis: Redis
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

    this.eventService.emit('user.created', {
      ...userCreated.toJSON(),
    });

    this.eventService.emit('user.verify_email.token.created', {
      user: userCreated.toJSON(),
      token: await this.createVerifyEmailToken(userCreated),
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
}
