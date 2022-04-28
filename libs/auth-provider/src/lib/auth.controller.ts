import { Body, Controller, Post } from '@nestjs/common';
import { OAuth2Service } from './services/oauth2.service';
import { OAuth2AuthenticateDto } from './dtos/oauth2/authenticate.dto';
import { ApiRoute } from '@polycode/docs';
import { OAuth2ClientGrant } from './models/OAuth2ClientGrant.model';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentification')
export class AuthController {
  constructor(private readonly oAuth2Service: OAuth2Service) {}

  @Post('/token')
  @ApiRoute({
    operation: {
      summary: 'Authenticate a subject through the OAuth2 protocol',
      description: 'Get a new access token and an optional refresh token',
    },
    body: {
      schema: {
        type: 'object',
        required: ['grant_type'],
        properties: {
          client_id: {
            type: 'string',
            format: 'uuid',
            description:
              'The client id who requested the token (required if grant_type is not `implicit`)',
          },
          client_secret: {
            type: 'string',
            description:
              'The client secret who requested the token (required if grant_type is not `implicit`)',
          },
          grant_type: {
            type: 'string',
            enum: [...Object.values(OAuth2ClientGrant)],
            description: 'The grant type of the token',
          },
          identity: {
            type: 'string',
            description:
              'The identity of the subject (required if grant_type is `implicit` or `password`)',
          },
          secret: {
            type: 'string',
            description:
              'The secret of the subject (required if grant_type is `implicit` or `password`)',
          },
        },
      },
    },
    response: {
      status: 201,
      description:
        'Returns an access token and an optional refresh token (if grant_type is not `implicit`) if the request is valid and approved',
      schema: {
        type: 'object',
        required: ['access_token'],
        properties: {
          access_token: {
            type: 'string',
            description: 'The access token',
          },
          refresh_token: {
            type: 'string',
            description: 'The refresh token',
          },
        },
      },
    },
  })
  async token(@Body() oAuth2AuthenticateDto: OAuth2AuthenticateDto) {
    return this.oAuth2Service.authenticate(oAuth2AuthenticateDto);
  }
}
