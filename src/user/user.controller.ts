import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findById(@Param() params: GetUserDto): Promise<User> {
    return this.userService.findById(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async update(
    @Param() params: UpdateUserDto,
    @Body() updateData: Partial<User>,
  ): Promise<User> {
    return this.userService.update(params.id, updateData);
  }

  @Delete(':id')
  async delete(@Param() params: DeleteUserDto): Promise<void> {
    return this.userService.delete(params.id);
  }
}
