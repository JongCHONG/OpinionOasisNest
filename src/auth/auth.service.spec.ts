import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let userService: Partial<Record<keyof UserService, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User',
  };

  beforeEach(() => {
    userService = {
      findByEmail: jest.fn(),
    };
    jwtService = {
      sign: jest.fn(),
    };
    authService = new AuthService(
      userService as unknown as UserService,
      jwtService as unknown as JwtService,
    );
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user data without password if credentials are valid', async () => {
      userService.findByEmail!.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser('test@example.com', 'password');
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
      });
      expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password', mockUser.password);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      userService.findByEmail!.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.validateUser('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      userService.findByEmail!.mockRejectedValue(new NotFoundException());

      await expect(
        authService.validateUser('notfound@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should rethrow unexpected errors', async () => {
      userService.findByEmail!.mockRejectedValue(new Error('Unexpected'));

      await expect(
        authService.validateUser('test@example.com', 'password'),
      ).rejects.toThrow('Unexpected');
    });
  });

  describe('login', () => {
    it('should return access_token if user is valid', async () => {
      jwtService.sign!.mockReturnValue('jwt-token');
      const result = await authService.login(mockUser as any);
      expect(result).toEqual({ access_token: 'jwt-token' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        userId: mockUser.id,
      });
    });

    it('should throw UnauthorizedException if jwtService.sign throws', async () => {
      jwtService.sign!.mockImplementation(() => {
        throw new Error('JWT error');
      });

      await expect(authService.login(mockUser as any)).rejects.toThrow(UnauthorizedException);
    });
  });
});