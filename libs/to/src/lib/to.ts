import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import to from 'await-to-js';
import { Environment } from '@polycode/env';

export interface IsOptions {
  message?: string;
}

const logger = new Logger('ToExceptionCatcher');
export async function to500<T>(promise: Promise<T>): Promise<T> {
  const [err, result] = await to<T>(promise);

  if (err) {
    logger.error('Throwing an 500 exception in to500');
    logger.error(err);
    throw new InternalServerErrorException(
      process.env.NODE_ENV === Environment.DEVELOPMENT ? err : undefined
    );
  }

  return result;
}

export async function is409(
  promise: Promise<unknown>,
  options: IsOptions = {}
) {
  const [err, result] = await to(promise);

  if (err) {
    throw new InternalServerErrorException(
      process.env.NODE_ENV === Environment.DEVELOPMENT ? err : undefined
    );
  }

  if (result) {
    throw new ConflictException(options.message || 'Resource already exists');
  }
}
