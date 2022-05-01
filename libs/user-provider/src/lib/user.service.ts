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

@Injectable()
export class UserProviderService {
  private readonly logger = new Logger(UserProviderService.name);

  constructor(private readonly eventService: EventService) {}

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

    return userCreated;
  }
}
