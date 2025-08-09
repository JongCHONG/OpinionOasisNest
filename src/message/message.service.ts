import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(data: Partial<Message>): Promise<Message> {
    console.log('Creating message:', data);

    try {
      const message = this.messageRepository.create(data);
      return await this.messageRepository.save(message);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Erreur lors de la création du message');
    }
  }

  async findAll(): Promise<Message[]> {
    try {
      return await this.messageRepository.find();
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Erreur lors de la récupération des messages',
      );
    }
  }

  async findById(id: string): Promise<Message> {
    try {
      const message = await this.messageRepository.findOne({ where: { id } });
      if (!message) {
        throw new NotFoundException('Message non trouvé');
      }
      return message;
    } catch (error) {
      console.error(error);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException(
            'Erreur lors de la récupération du message',
          );
    }
  }

  async update(id: string, updateData: Partial<Message>): Promise<Message> {
    try {
      const result = await this.messageRepository.update(id, updateData);
      if (result.affected === 0) {
        throw new NotFoundException('Message à mettre à jour non trouvé');
      }
      return this.findById(id);
    } catch (error) {
      console.error(error);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException(
            'Erreur lors de la mise à jour du message',
          );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await this.messageRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Message à supprimer non trouvé');
      }
    } catch (error) {
      console.error(error);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException(
            'Erreur lors de la suppression du message',
          );
    }
  }
}
