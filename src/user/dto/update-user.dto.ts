import { IsString } from "class-validator";

export class UpdateUserDto {
  @IsString()
  nom: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}
