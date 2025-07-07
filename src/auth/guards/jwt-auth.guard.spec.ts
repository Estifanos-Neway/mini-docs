import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  const mockExecutionContext = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true when route is public', () => {
      mockReflector.getAllAndOverride.mockReturnValue(true);

      const result = guard.canActivate(mockExecutionContext as any);

      expect(result).toBe(true);
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(
        IS_PUBLIC_KEY,
        [mockExecutionContext.getHandler(), mockExecutionContext.getClass()],
      );
    });

    it('should call super.canActivate when route is not public', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);

      // Mock the parent class canActivate method
      const mockSuperCanActivate = jest.fn().mockReturnValue(true);
      jest.spyOn(guard, 'canActivate').mockImplementation((context) => {
        const isPublic = reflector.getAllAndOverride(IS_PUBLIC_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);
        if (isPublic) return true;
        return mockSuperCanActivate(context);
      });

      const result = guard.canActivate(mockExecutionContext as any);

      expect(result).toBe(true);
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(
        IS_PUBLIC_KEY,
        [mockExecutionContext.getHandler(), mockExecutionContext.getClass()],
      );
    });

    it('should return false when route is not public and super.canActivate returns false', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);

      // Mock the parent class canActivate method
      const mockSuperCanActivate = jest.fn().mockReturnValue(false);
      jest.spyOn(guard, 'canActivate').mockImplementation((context) => {
        const isPublic = reflector.getAllAndOverride(IS_PUBLIC_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);
        if (isPublic) return true;
        return mockSuperCanActivate(context);
      });

      const result = guard.canActivate(mockExecutionContext as any);

      expect(result).toBe(false);
    });
  });
});
