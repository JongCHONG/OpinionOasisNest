import { IsString, IsUUID } from "class-validator";

export class UpdateUserDto {
  @IsUUID()
  id: string;

  @IsString()
  username: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}
