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
import { CreateMessageDto } from './dto/create-messaage.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { DeleteMessageDto } from './dto/delete-message.dto';

@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async create(@Body() data: CreateMessageDto): Promise<Message> {
    return this.messageService.create(data);
  }

  @Get()
  async findAll(): Promise<Message[]> {
    return this.messageService.findAll();
  }

  @Put(':id')
  async update(
    @Param() params: UpdateMessageDto,
    @Body() updateData: Partial<Message>,
  ): Promise<Message> {
    return this.messageService.update(params.id, updateData);
  }

  @Delete(':id')
  async delete(@Param() params: DeleteMessageDto): Promise<void> {
    return this.messageService.delete(params.id);
  }
}
