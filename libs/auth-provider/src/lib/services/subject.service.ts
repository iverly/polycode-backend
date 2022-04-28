import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import to from 'await-to-js';
import { Subject } from '../models/Subject.model';
import { SubjectCredentials } from '../models/SubjectCredentials.model';
import { CryptoService } from './crypto.service';

@Injectable()
export class SubjectService {
  private readonly logger = new Logger(SubjectService.name);

  constructor(private readonly cryptoService: CryptoService) {}

  /**
   * It takes a username and password, and returns a user if the username and password are valid
   * @param {string} identity - The identity of the subject.
   * @param {string} secret - The secret that the subject is trying to authenticate with.
   * @returns A subject
   */
  async getByCredentials(identity: string, secret: string): Promise<Subject> {
    const [err, subject] = await to<Subject | null>(
      Subject.findOne({
        include: [
          {
            model: SubjectCredentials,
            as: 'credentials',
            required: true,
            where: {
              identity,
            },
          },
        ],
      })
    );

    if (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }

    if (!subject) {
      throw new UnauthorizedException('Invalid subject: subject not found');
    }

    if (
      !(await this.cryptoService.compareBcrypt(
        secret,
        subject.credentials.secret
      ))
    ) {
      throw new UnauthorizedException('Invalid subject: secret is invalid');
    }

    return subject;
  }
}
