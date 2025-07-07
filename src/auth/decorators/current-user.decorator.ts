import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../../interfaces/auth-user.interface';
import { RequestWithUser } from '../../interfaces/request-with-user.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUser | undefined => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
