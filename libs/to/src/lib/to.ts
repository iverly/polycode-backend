import { InternalServerErrorException } from '@nestjs/common';
import to from 'await-to-js';

export async function to500<T>(promise: Promise<T>): Promise<T> {
  const [err, result] = await to<T>(promise);

  if (err) {
    throw new InternalServerErrorException(err);
  }

  return result;
}
