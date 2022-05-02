import { Environment } from '@polycode/env';
import { plainToClass } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsString,
  validateSync,
  IsUrl,
} from 'class-validator';

/* It's a class that contains all the environment variables that the application needs to run */
class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString({
    message: 'The environment variable "AUTH_DATABASE_NAME" must be a string',
  })
  AUTH_DATABASE_NAME: string;

  @IsString({
    message: 'The environment variable "AUTH_DATABASE_USER" must be a string',
  })
  AUTH_DATABASE_USER: string;

  @IsString({
    message:
      'The environment variable "AUTH_DATABASE_PASSWORD" must be a string',
  })
  AUTH_DATABASE_PASSWORD: string;

  @IsString({
    message: 'The environment variable "AUTH_DATABASE_HOST" must be a string',
  })
  AUTH_DATABASE_HOST: string;

  @IsNumber(
    {},
    {
      message: 'The environment variable "AUTH_DATABASE_PORT" must be a number',
    }
  )
  AUTH_DATABASE_PORT: number;

  @IsUrl(
    { protocols: ['redis', 'rediss'] },
    {
      message: 'The environment variable "REDIS_URL" must be a string',
    }
  )
  REDIS_URL: string;

  @IsUrl(
    { protocols: ['http', 'https'] },
    {
      message: 'The environment variable "PUBLIC_WWW_URL" must be a string',
    }
  )
  PUBLIC_WWW_URL: string;
}

/**
 * It takes a config object, validates it, and returns the validated object
 * @param config - The configuration object to validate.
 * @returns The validated config object.
 */
export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  /* This is validating the config object. */
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
