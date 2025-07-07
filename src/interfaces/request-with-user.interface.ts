import { AuthUser } from './auth-user.interface';

export interface RequestWithUser {
  user?: AuthUser;
}
