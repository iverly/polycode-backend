import { Injectable } from '@nestjs/common';
import { AuthService } from '@polycode/auth-provider';
import { IRolePolicy } from './interfaces';
import { IRole } from './interfaces/role.interface';
import { SubjectService } from '@polycode/auth-provider';
import { SubjectType } from './types';
import { to500 } from '@polycode/to';

export interface Subject {
  id: string;
  type: string;
  internalIdentifier: string;
}

export interface IAuthorizeResponse {
  subject?: Subject;
  roles?: IRole[];
}

export enum CredentialsType {
  EMAIL_WITH_PASSWORD = 'email_with_password',
}

@Injectable()
export class AuthConsumerService {
  constructor(
    private readonly authService: AuthService,
    private readonly subjectService: SubjectService
  ) {}

  /**
   * It takes an authorization header, passes it to the auth service, and returns the response
   * @param {string} authorizationHeader - The authorization header that was sent in the request.
   * @returns An object with a subject and roles property.
   */
  async authorize(authorizationHeader: string): Promise<IAuthorizeResponse> {
    const authorizeResponse = await this.authService.authorize(
      authorizationHeader
    );

    return {
      subject: authorizeResponse.subject,
      roles: (authorizeResponse.roles || []).map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        polices: role.policies.map(
          (policy) =>
            ({
              action: policy.action,
              resource: policy.resource,
              attributes: policy.attributes,
            } as IRolePolicy)
        ),
      })),
    };
  }

  /**
   * It creates a user with the given email and password
   * @param {string} id - The id of the subject.
   * @param {string} email - The email address of the user.
   * @param {string} password - string
   */
  async createSubjectAsUser(
    id: string,
    email: string,
    password: string
  ): Promise<void> {
    const subject: Subject = await to500<Subject>(
      this.subjectService.create(id, SubjectType.USER)
    );

    await to500(
      this.subjectService.addCredentials(
        subject,
        CredentialsType.EMAIL_WITH_PASSWORD,
        email,
        password
      )
    );

    await to500(
      this.subjectService.addRole(subject, {
        id: '657d788a-dd48-411a-acf4-47d347e6304d', // default user group id
      })
    );
  }
}
