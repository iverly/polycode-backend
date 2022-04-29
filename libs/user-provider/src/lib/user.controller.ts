import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Authorize, UserReadSelfAuthorize } from '@polycode/auth-consumer';
import { ApiRoute, ApiRouteAuthenticated } from '@polycode/docs';
import { is409 } from '@polycode/to';
import { UserCreateDto } from './dtos/user.dto';
import { UserProviderService } from './user.service';
import { Op } from 'sequelize';

@Controller('user')
@ApiTags('User')
export class UserProviderController {
  constructor(private userProviderService: UserProviderService) {}

  @Post()
  @ApiRoute({
    operation: {
      summary: 'Create a user',
      description: 'Create a new user and store it in the system',
    },
    body: {
      schema: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: {
            type: 'string',
            description: 'The user username',
          },
          email: {
            type: 'string',
            description: 'The user email',
          },
          password: {
            type: 'string',
            description: 'The user password',
          },
        },
      },
    },
    response: {
      status: 201,
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
    others: [
      ApiConflictResponse({
        description: 'User already exists',
      }),
    ],
  })
  async create(@Body() userCreateDto: UserCreateDto) {
    // check if user already exists in the database
    await is409(
      this.userProviderService.findOne({
        [Op.or]: [
          {
            username: userCreateDto.username,
          },
          {
            email: userCreateDto.email,
          },
        ],
      }),
      {
        message: 'User already exists',
      }
    );

    const user = await this.userProviderService.create(userCreateDto);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
    };
  }

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
    others: [
      ApiNotFoundResponse({
        description: 'User not found',
      }),
    ],
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
