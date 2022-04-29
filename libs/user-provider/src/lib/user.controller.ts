import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Authorize, UserReadSelfAuthorize } from '@polycode/auth-consumer';
import { ApiRouteAuthenticated } from '@polycode/docs';
import { UserProviderService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserProviderController {
  constructor(private userProviderService: UserProviderService) {}

  @Get('/:id')
  @Authorize(UserReadSelfAuthorize)
  @ApiRouteAuthenticated({
    operation: {
      summary: 'Get a user by his identifier',
      description: 'Get the user information with the given identifier',
    },
    response: {
      status: 200,
      description: 'Returns the user information',
      schema: {
        type: 'object',
        required: ['id', 'username', 'email', 'isEmailVerified'],
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'The user identifier',
          },
          username: {
            type: 'string',
            description: 'The user username',
          },
          email: {
            type: 'string',
            description: 'The user email',
          },
          isEmailVerified: {
            type: 'boolean',
            description: 'Whether the user email is verified',
          },
        },
      },
    },
  })
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.userProviderService.findById(id);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
    };
  }
}
