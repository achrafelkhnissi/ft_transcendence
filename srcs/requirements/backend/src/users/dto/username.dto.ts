import { Matches } from 'class-validator';

export class UsernameDto {
  @Matches(/^[a-z]+(-[a-z]+)*$/, {
    message:
      'Username must contain only lowercase letters and dashes, and cannot start or end with a dash',
  })
  username: string;
}
