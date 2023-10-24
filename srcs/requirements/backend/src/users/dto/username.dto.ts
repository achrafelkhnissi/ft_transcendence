import { Matches, MinLength } from 'class-validator';

export class UsernameDto {
  @Matches(/^[a-z]+(-[a-z]+)*$/, {
    message:
      'Username must contain only lowercase letters and dashes, and cannot start or end with a dash',
  })
  @MinLength(4, {
    message: 'Username must be at least 4 characters long',
  })
  username: string;
}
