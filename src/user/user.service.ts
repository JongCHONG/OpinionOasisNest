import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    try {
      const saltRounds = 10;
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, saltRounds);
      }
      const user = this.userRepository.create(userData);
      return await this.userRepository.save(user);
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        "Erreur lors de la création de l'utilisateur",
      );
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Erreur lors de la récupération des utilisateurs',
      );
    }
  }

  async findById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }
      return user;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(
        "Erreur lors de la récupération de l'utilisateur",
      );
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }
      return user;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(
        "Erreur lors de la récupération de l'utilisateur",
      );
    }
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    try {
      if (updateData.password) {
        const saltRounds = 10;
        updateData.password = await bcrypt.hash(
          updateData.password,
          saltRounds,
        );
      }
      const result = await this.userRepository.update(id, updateData);
      if (result.affected === 0) {
        throw new NotFoundException('Utilisateur à mettre à jour non trouvé');
      }
      return this.findById(id);
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(
        "Erreur lors de la mise à jour de l'utilisateur",
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Utilisateur à supprimer non trouvé');
      }
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(
        "Erreur lors de la suppression de l'utilisateur",
      );
    }
  }
}
