import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { to500 } from '@polycode/to';
import { Subject, SubjectType } from '../models/Subject.model';
import {
  CredentialsType,
  SubjectCredentials,
} from '../models/SubjectCredentials.model';
import { CryptoService } from './crypto.service';
import { Role } from '../models/Role.model';
import { SubjectRoles } from '../models/SubjectRoles.model';

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
    const subject = await to500<Subject | null>(
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

  /**
   * It creates a new subject in the database
   * @param {string} internalIdentifier - The internal identifier of the subject.
   * @param {SubjectType} type - SubjectType - This is the type of the subject. It can be either a user
   * or a group.
   * @returns A promise that resolves to a Subject
   */
  async create(internalIdentifier: string, type: SubjectType) {
    return await to500<Subject>(
      Subject.create({
        internalIdentifier,
        type,
      })
    );
  }

  /**
   * It creates a new SubjectCredentials object, hashes the secret, and saves it to the database
   * @param {Subject} subject - The subject that the credentials are being added to.
   * @param {CredentialsType} type - CredentialsType - this is an enum that is defined in the
   * SubjectCredentials model. It's a string that can be one of the following:
   * @param {string} identity - The username or email address of the user
   * @param {string} secret - The secret that the user entered.
   * @returns A promise that resolves to a SubjectCredentials object.
   */
  async addCredentials(
    subject: { id: string },
    type: CredentialsType,
    identity: string,
    secret: string
  ) {
    return await to500<SubjectCredentials>(
      SubjectCredentials.create({
        subjectId: subject.id,
        type,
        identity,
        secret: await this.cryptoService.hashBcrypt(secret),
      })
    );
  }

  /**
   * > Add a role to a subject
   * @param {Subject} subject - Subject - The subject to add the role to
   * @param {Role} role - Role - This is the role that we want to add to the subject.
   * @returns A promise of a SubjectRoles object
   */
  async addRole(
    subject: { id: string },
    role: { id: string }
  ): Promise<SubjectRoles> {
    return await to500<SubjectRoles>(
      SubjectRoles.create({
        subjectId: subject.id,
        roleId: role.id,
      })
    );
  }
}
