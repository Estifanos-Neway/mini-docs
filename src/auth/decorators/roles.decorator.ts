import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../interfaces/auth-user.interface';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
