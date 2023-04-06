import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const ReqUser = createParamDecorator(
  (data: string[] | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;
    if (Array.isArray(data) && data.length !== 0) {
      const dataSet = new Set(data);
      const ret = {};
      Object.keys(user).forEach((key) => {
        if (dataSet.has(key)) {
          ret[key] = user[key];
        }
      });
      return ret;
    }
    return user;
  },
);
