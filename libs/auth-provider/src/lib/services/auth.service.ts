import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(private readonly tokenService: TokenService) {}

  /**
   * It takes an authorization header, splits it into two parts, verifies the second part, and returns
   * the result
   * @param {string} authorizationHeader - The authorization header that was passed in the request.
   * @returns The token is being returned.
   */
  async authorize(authorizationHeader: string) {
    if (!authorizationHeader) {
      throw new UnauthorizedException();
    }

    const authorizationSplit = `${authorizationHeader}`.trim().split(' ');
    if (authorizationSplit.length !== 2) {
      throw new UnauthorizedException();
    }

    const bearer = authorizationSplit[1];
    if (!bearer) {
      throw new UnauthorizedException();
    }

    const token = await this.tokenService.verifyToken(bearer);

    return {
      status: 'success',
      ...(token.subject && {
        subject: {
          id: token.subject.id,
          type: token.subject.type,
          internalIdentifier: token.subject.internalIdentifier,
        },
        roles: token.subject.roles,
      }),
    };
  }
}
