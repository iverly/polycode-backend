import { plainToClass } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';

/* It's a class that contains all the environment variables that the application needs to run */
class EnvironmentVariables {
  @IsString({
    message:
      'The environment variable "EMAIL_AWS_ACCESS_API_KEY" must be a string',
  })
  EMAIL_AWS_ACCESS_API_KEY: string;

  @IsString({
    message:
      'The environment variable "EMAIL_AWS_API_ACCESS_SECRET" must be a string',
  })
  EMAIL_AWS_API_ACCESS_SECRET: string;

  @IsString({
    message: 'The environment variable "EMAIL_AWS_REGION" must be a string',
  })
  EMAIL_AWS_REGION: string;

  @IsString({
    message: 'The environment variable "EMAIL_FROM" must be a string',
  })
  EMAIL_FROM: string;
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
