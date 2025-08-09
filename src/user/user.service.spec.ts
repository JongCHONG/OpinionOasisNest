import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<Repository<User>>;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
    service = new UserService(userRepository);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should hash password and save user', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      userRepository.create.mockReturnValue({
        email: 'test',
        password: 'hashedPassword',
      } as User);
      userRepository.save.mockResolvedValue({
        id: '1',
        email: 'test',
        password: 'hashedPassword',
      } as User);

      const result = await service.create({ email: 'test', password: 'plain' });
      expect(bcrypt.hash).toHaveBeenCalledWith('plain', 10);
      expect(userRepository.create).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalled();
      expect(result).toEqual({
        id: '1',
        email: 'test',
        password: 'hashedPassword',
      });
    });

    it('should throw BadRequestException on error', async () => {
      userRepository.create.mockImplementation(() => {
        throw new Error('fail');
      });
      await expect(service.create({ email: 'test' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      userRepository.find.mockResolvedValue([{ id: '1' }] as User[]);
      const result = await service.findAll();
      expect(result).toEqual([{ id: '1' }]);
    });

    it('should throw BadRequestException on error', async () => {
      userRepository.find.mockRejectedValue(new Error('fail'));
      await expect(service.findAll()).rejects.toThrow(BadRequestException);
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      userRepository.findOne.mockResolvedValue({ id: '1' } as User);
      const result = await service.findById('1');
      expect(result).toEqual({ id: '1' });
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      await expect(service.findById('1')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on error', async () => {
      userRepository.findOne.mockRejectedValue(new Error('fail'));
      await expect(service.findById('1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      userRepository.findOne.mockResolvedValue({ email: 'test' } as User);
      const result = await service.findByEmail('test');
      expect(result).toEqual({ email: 'test' });
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      await expect(service.findByEmail('test')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException on error', async () => {
      userRepository.findOne.mockRejectedValue(new Error('fail'));
      await expect(service.findByEmail('test')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should hash password and update user', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      userRepository.update.mockResolvedValue(
        await ({ affected: 1 } as Partial<
          ReturnType<Repository<User>['update']>
        >),
      );
      jest
        .spyOn(service, 'findById')
        .mockResolvedValue({ id: '1', password: 'hashedPassword' } as User);

      const result = await service.update('1', { password: 'plain' });
      expect(bcrypt.hash).toHaveBeenCalledWith('plain', 10);
      expect(userRepository.update).toHaveBeenCalledWith('1', {
        password: 'hashedPassword',
      });
      expect(result).toEqual({ id: '1', password: 'hashedPassword' });
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.update.mockResolvedValue({ affected: 0 } as any);
      await expect(service.update('1', {})).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on error', async () => {
      userRepository.update.mockRejectedValue(new Error('fail'));
      await expect(service.update('1', {})).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      userRepository.delete.mockResolvedValue({
        affected: 1,
        raw: {},
      } as any);
      await expect(service.delete('1')).resolves.toBeUndefined();
      expect(userRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.delete.mockResolvedValue({
        affected: 0,
        raw: {},
      } as any);
      await expect(service.delete('1')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on error', async () => {
      userRepository.delete.mockRejectedValue(new Error('fail'));
      await expect(service.delete('1')).rejects.toThrow(BadRequestException);
    });
  });
});
