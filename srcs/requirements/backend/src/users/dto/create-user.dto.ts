import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

// TODO: Update this DTO to match the requirements && constraints of the User & Add validation.
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}
