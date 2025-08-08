import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  nom: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}