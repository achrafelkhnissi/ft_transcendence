import { $Enums } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateChatDto {
  @IsEnum($Enums.ConversationType)
  @IsNotEmpty()
  type: $Enums.ConversationType;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, {
    message: 'Name must be at least 6 characters long',
  })
  name: string;

  /**
   * (?=.*[a-z]): The string must contain at least 1 lowercase alphabetical character.
   * (?=.*[A-Z]): The string must contain at least 1 uppercase alphabetical character.
   * (?=.*\d): The string must contain at least 1 numeric character.
   * (?=.*[@$!%*?&]): The string must contain at least one special character.
   * [A-Za-z\d@$!%*?&]{8,}: The string must be eight characters or longer.
   */
  @ValidateIf((o) => o.type === $Enums.ConversationType.PROTECTED)
  @IsNotEmpty()
  @IsString()
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: 'Password too weak',
    },
  )
  password: string;
}
