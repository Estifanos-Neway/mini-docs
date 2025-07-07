import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as fs from 'fs';
import * as path from 'path';
import { AuthUser, UserRole } from '../../interfaces/auth-user.interface';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub: string;
  email: string;
  fullname: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['RS256'],
      secretOrKey: fs.readFileSync(
        configService.get<string>('JWT_PUBLIC_KEY_PATH') || '',
        'utf8',
      ),
      ignoreExpiration: false,
    });
  }

  validate(payload: JwtPayload): AuthUser {
    if (!payload.sub || !payload.email || !payload.role) {
      throw new UnauthorizedException('Invalid token');
    }

    if (!Object.values(UserRole).includes(payload.role)) {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      id: payload.sub,
      email: payload.email,
      fullname: payload.fullname,
      role: payload.role,
    };
  }
}
