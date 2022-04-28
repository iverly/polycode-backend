import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TokenService } from './token.service';
import { ClientService } from './client.service';
import { OAuth2AuthenticateDto } from '../dtos/oauth2/authenticate.dto';
import { OAuth2ClientGrant } from '../models/OAuth2ClientGrant.model';
import { SubjectService } from './subject.service';
import { DateTime } from 'luxon';
import { TokenType } from '../models/OAuth2Token.model';

@Injectable()
export class OAuth2Service {
  constructor(
    private readonly tokenService: TokenService,
    private readonly subjectService: SubjectService
  ) {}

  /**
   * > This function is called when a user tries to authenticate with the OAuth2 server
   * @param {OAuth2AuthenticateDto} oAuth2AuthenticateDto - This is the object that contains the
   * parameters that are passed in the request.
   * @returns The access token and an optional refresh token
   */
  async authenticate(
    oAuth2AuthenticateDto: OAuth2AuthenticateDto
  ): Promise<any> {
    if (oAuth2AuthenticateDto.grant_type === OAuth2ClientGrant.IMPLICIT) {
      return this.handleImplicitGrant(oAuth2AuthenticateDto);
    }

    throw new BadRequestException(
      'Invalid grant_type: grant_type is not supported'
    );
  }

  /**
   * It creates an access token for the subject, saves it, and returns it
   * @param {OAuth2AuthenticateDto} oAuth2AuthenticateDto - OAuth2AuthenticateDto
   * @returns An object with the access token and the token type.
   */
  async handleImplicitGrant(oAuth2AuthenticateDto: OAuth2AuthenticateDto) {
    const subject = await this.subjectService.getByCredentials(
      oAuth2AuthenticateDto.identity,
      oAuth2AuthenticateDto.secret
    );

    const expiresAt = this.getExpirationDateByGrantType(
      OAuth2ClientGrant.IMPLICIT
    );

    const accessToken = this.tokenService.createSubjectAccessToken(
      subject,
      null,
      expiresAt
    );
    await this.tokenService.saveToken(
      accessToken,
      expiresAt,
      TokenType.ACCESS_TOKEN,
      OAuth2ClientGrant.IMPLICIT,
      subject
    );

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_at: expiresAt,
    };
  }

  /**
   * If the grant type is IMPLICIT, return a date 3 days from now, otherwise return a date 1 hour from
   * now.
   * @param {OAuth2ClientGrant} grantType - The type of grant that the client is requesting.
   * @returns A date object
   */
  getExpirationDateByGrantType(grantType: OAuth2ClientGrant) {
    switch (grantType) {
      case OAuth2ClientGrant.IMPLICIT:
        return DateTime.now().plus({ days: 3 }).toJSDate();
      default:
        return DateTime.now().plus({ hour: 1 }).toJSDate();
    }
  }
}
