import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './message.entity';

@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async create(@Body() data: Partial<Message>): Promise<Message> {
    return this.messageService.create(data);
  }

  @Get()
  async findAll(): Promise<Message[]> {
    return this.messageService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Message> {
    return this.messageService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<Message>,
  ): Promise<Message> {
    return this.messageService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.messageService.delete(id);
  }
}