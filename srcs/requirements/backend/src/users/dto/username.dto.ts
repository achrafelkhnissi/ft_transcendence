import { IsAlpha } from 'class-validator';

export class UsernameDto {
  @IsAlpha('en-US', { message: 'Username must contain only letters' })
  username: string;
}
