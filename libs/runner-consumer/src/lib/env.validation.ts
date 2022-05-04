import { plainToClass } from 'class-transformer';
import { IsUrl, validateSync, IsString } from 'class-validator';

/* It's a class that contains all the environment variables that the application needs to run */
class EnvironmentVariables {
  @IsString({
    message: 'The environment variable "RUNNER_API_URL" must be a string',
  })
  RUNNER_API_URL: string;
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
