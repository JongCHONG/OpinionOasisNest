import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-messaage.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { DeleteMessageDto } from './dto/delete-message.dto';
import { Message } from './message.entity';

describe('MessageController', () => {
  let controller: MessageController;
  let service: MessageService;

  const mockMessage: Message = {
    id: '1',
    text: 'Hello',
    user: 'User',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Message;

  const mockService = {
    create: jest.fn().mockResolvedValue(mockMessage),
    findAll: jest.fn().mockResolvedValue([mockMessage]),
    update: jest.fn().mockResolvedValue({ ...mockMessage, text: 'Updated' }),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [{ provide: MessageService, useValue: mockService }],
    }).compile();

    controller = module.get<MessageController>(MessageController);
    service = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a message', async () => {
      const dto: CreateMessageDto = { text: 'Hello', userId: 'User' };
      await expect(controller.create(dto)).resolves.toEqual(mockMessage);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all messages', async () => {
      await expect(controller.findAll()).resolves.toEqual([mockMessage]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a message', async () => {
      const params: UpdateMessageDto = { id: '1', text: 'Updated' };
      const updateData: Partial<Message> = { text: 'Updated' };
      await expect(controller.update(params, updateData)).resolves.toEqual({
        ...mockMessage,
        text: 'Updated',
      });
      expect(service.update).toHaveBeenCalledWith('1', updateData);
    });
  });

  describe('delete', () => {
    it('should delete a message', async () => {
      const params: DeleteMessageDto = { id: "1" };
      await expect(controller.delete(params)).resolves.toBeUndefined();
      expect(service.delete).toHaveBeenCalledWith("1");
    });
  });
});
