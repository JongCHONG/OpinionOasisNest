import { Injectable, NotFoundException } from '@nestjs/common';
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
    const message = this.messageRepository.create(data);
    return await this.messageRepository.save(message);
  }

  async findAll(): Promise<Message[]> {
    return await this.messageRepository.find();
  }

  async findById(id: string): Promise<Message> {
    const message = await this.messageRepository.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException('Message non trouvé');
    }
    return message;
  }

  async update(id: string, updateData: Partial<Message>): Promise<Message> {
    const result = await this.messageRepository.update(id, updateData);
    if (result.affected === 0) {
      throw new NotFoundException('Message à mettre à jour non trouvé');
    }
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const result = await this.messageRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Message à supprimer non trouvé');
    }
  }
}
