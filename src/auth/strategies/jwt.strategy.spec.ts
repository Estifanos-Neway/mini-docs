import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { UserRole } from '../../interfaces/auth-user.interface';
import * as fs from 'fs';
import * as path from 'path';

// Mock fs and path modules
jest.mock('fs');
jest.mock('path');

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockFs = {
    readFileSync: jest.fn(),
  };

  const mockPath = {
    join: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    // Setup mocks
    (fs as any).readFileSync = mockFs.readFileSync;
    (path as any).join = mockPath.join;

    mockConfigService.get.mockReturnValue('test-cert-path');
    mockFs.readFileSync.mockReturnValue('test-public-key');
    mockPath.join.mockReturnValue('/test/path/cert');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return AuthUser when payload is valid', () => {
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        fullname: 'Test User',
        role: UserRole.Client,
        iat: 1234567890,
        exp: 1234567890,
      };

      const result = strategy.validate(payload);

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        fullname: 'Test User',
        role: UserRole.Client,
      });
    });

    it('should return AuthUser for Admin role', () => {
      const payload = {
        sub: 'admin-123',
        email: 'admin@example.com',
        fullname: 'Admin User',
        role: UserRole.Admin,
      };

      const result = strategy.validate(payload);

      expect(result).toEqual({
        id: 'admin-123',
        email: 'admin@example.com',
        fullname: 'Admin User',
        role: UserRole.Admin,
      });
    });

    it('should throw UnauthorizedException when sub is missing', () => {
      const payload = {
        email: 'test@example.com',
        fullname: 'Test User',
        role: UserRole.Client,
      } as any;

      expect(() => strategy.validate(payload)).toThrow(UnauthorizedException);
      expect(() => strategy.validate(payload)).toThrow('Invalid token');
    });

    it('should throw UnauthorizedException when email is missing', () => {
      const payload = {
        sub: 'user-123',
        fullname: 'Test User',
        role: UserRole.Client,
      } as any;

      expect(() => strategy.validate(payload)).toThrow(UnauthorizedException);
      expect(() => strategy.validate(payload)).toThrow('Invalid token');
    });

    it('should throw UnauthorizedException when role is missing', () => {
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        fullname: 'Test User',
      } as any;

      expect(() => strategy.validate(payload)).toThrow(UnauthorizedException);
      expect(() => strategy.validate(payload)).toThrow('Invalid token');
    });

    it('should throw UnauthorizedException when role is invalid', () => {
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        fullname: 'Test User',
        role: 'InvalidRole',
      } as any;

      expect(() => strategy.validate(payload)).toThrow(UnauthorizedException);
      expect(() => strategy.validate(payload)).toThrow('Invalid token');
    });
  });

  describe('constructor', () => {
    it('should configure JWT strategy with correct options', () => {
      expect(mockConfigService.get).toHaveBeenCalledWith('JWT_PUBLIC_KEY_PATH');
      expect(mockFs.readFileSync).toHaveBeenCalledWith(
        '/test/path/cert',
        'utf8',
      );
      expect(mockPath.join).toHaveBeenCalled();
    });

    it('should use production path when NODE_ENV is production', () => {
      mockConfigService.get
        .mockReturnValueOnce('prod-cert-path')
        .mockReturnValueOnce('production');

      new JwtStrategy(configService);

      expect(mockPath.join).toHaveBeenCalledWith(
        expect.any(String),
        'prod-cert-path',
      );
    });

    it('should use development path when NODE_ENV is not production', () => {
      mockConfigService.get
        .mockReturnValueOnce('dev-cert-path')
        .mockReturnValueOnce('development');

      new JwtStrategy(configService);

      expect(mockPath.join).toHaveBeenCalledWith(
        expect.any(String),
        '../../../dev-cert-path',
      );
    });
  });
});
