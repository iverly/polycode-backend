import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiBodyOptions,
  ApiForbiddenResponse,
  ApiHeader,
  ApiOperation,
  ApiOperationOptions,
  ApiParam,
  ApiParamOptions,
  ApiResponse,
  ApiResponseOptions,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

interface ApiRouteOptions {
  operation?: ApiOperationOptions;
  response?: ApiResponseOptions;
  params?: ApiParamOptions[];
  body?: ApiBodyOptions;
  others?: (MethodDecorator & ClassDecorator)[];
}

export const ApiRoute = (options: ApiRouteOptions = {}) =>
  applyDecorators(
    ...((options.operation && [ApiOperation(options.operation)]) || []),
    ...((options.response && [ApiResponse(options.response)]) || []),
    ...((options.body && [ApiBody(options.body)]) || []),
    ...(options.params || []).map((param) => ApiParam(param)),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error occurred',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Bad request error occurred',
    }),
    ...(options.others || [])
  );

export const ApiRouteAuthenticated = (options: ApiRouteOptions = {}) =>
  applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description:
        'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}".',
      required: true,
    }),
    ApiForbiddenResponse({
      description: 'Forbidden access to the requested resource',
    }),
    ApiUnauthorizedResponse({
      description: 'Authorization properties are missing from the request',
    }),
    ApiRoute(options)
  );
