import { Injectable } from '@nestjs/common';
import { AuthService } from '@polycode/auth-provider';
import { IRole } from './interfaces/role.interface';

interface IAuthorizeResponse {
  subject?: {
    id: string;
    type: string;
    internalIdentifier: string;
  };
  roles?: IRole[];
}

@Injectable()
export class AuthConsumerService {
  constructor(private readonly authService: AuthService) {}

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
        polices: role.policies,
      })),
    };
  }
}
