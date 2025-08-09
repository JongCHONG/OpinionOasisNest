import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { User } from './user.entity';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUser: User = {
    id: '1',
    username: 'test',
    email: 'test@test.com',
  } as User;
  const mockUsers: User[] = [mockUser];

  const mockUserService = {
    create: jest.fn().mockResolvedValue(mockUser),
    findAll: jest.fn().mockResolvedValue(mockUsers),
    findById: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockImplementation((id, updateData) => ({
      id,
      ...updateData,
    })),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto: CreateUserDto = {
        username: 'test',
        email: 'test@test.com',
        password: 'pass',
      };
      await expect(controller.create(dto)).resolves.toEqual(mockUser);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      await expect(controller.findAll()).resolves.toEqual(mockUsers);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const params: GetUserDto = { id: '1' };
      await expect(controller.findById(params)).resolves.toEqual(mockUser);
      expect(service.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const params: UpdateUserDto = {
        id: '1',
        username: 'updated',
        email: 'updated@test.com',
        password: 'newpass',
      };
      const updateData = {
        username: 'updated',
        email: 'updated@test.com',
        password: 'newpass',
      };
      await expect(controller.update(params, updateData)).resolves.toEqual({
        ...mockUser,
        username: 'updated',
        email: 'updated@test.com',
        password: 'newpass',
      });
      expect(service.update).toHaveBeenCalledWith('1', updateData);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const params: DeleteUserDto = { id: '1' };
      await expect(controller.delete(params)).resolves.toBeUndefined();
      expect(service.delete).toHaveBeenCalledWith('1');
    });
  });
});
