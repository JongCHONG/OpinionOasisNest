import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return login result when credentials are valid', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'password' };
      const user = { id: 1, email: loginDto.email };
      const loginResult = { accessToken: 'token' };

      mockAuthService.validateUser.mockResolvedValue(user);
      mockAuthService.login.mockReturnValue(loginResult);

      const result = await authController.login(loginDto);

      expect(mockAuthService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
      expect(result).toBe(loginResult);
    });

    it('should throw error when credentials are invalid', async () => {
      const loginDto: LoginDto = { email: 'wrong@example.com', password: 'wrong' };
      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(authController.login(loginDto)).rejects.toThrow('Invalid credentials');
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });
  });
});