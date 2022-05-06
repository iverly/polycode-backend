import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Incoming = createParamDecorator((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request;
});

export const Subject = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (key) {
      return request.authorization?.subject[key];
    }

    return request.authorization?.subject;
  }
);
