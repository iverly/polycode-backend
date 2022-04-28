import { plainToClass } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsUrl,
  MinLength,
  validateSync,
} from 'class-validator';

/* It's a class that contains all the environment variables that the application needs to run */
class EnvironmentVariables {
  @IsString({
    message: 'The environment variable "AUTH_JWT_SECRET" must be a string',
  })
  @MinLength(10, {
    message:
      'The environment variable "AUTH_JWT_SECRET" must be at least 10 character',
  })
  AUTH_JWT_SECRET: string;

  @IsUrl(
    { protocols: ['https'] },
    {
      message: 'The environment variable "AUTH_JWT_SECRET" must be a string',
    },
  )
  AUTH_JWT_ISSUER: string;

  @IsUrl(
    { protocols: ['https'] },
    {
      message: 'The environment variable "AUTH_JWT_AUDIENCE" must be a string',
    },
  )
  AUTH_JWT_AUDIENCE: string;
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
