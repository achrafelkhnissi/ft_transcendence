import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateChatDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'The type of the chat',
    enum: $Enums.ConversationType,
    isArray: true,
    example: [
      $Enums.ConversationType.DM,
      $Enums.ConversationType.PROTECTED,
      $Enums.ConversationType.PUBLIC,
      $Enums.ConversationType.PRIVATE,
    ],
  })
  @IsEnum($Enums.ConversationType)
  @IsNotEmpty()
  type: $Enums.ConversationType;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(6, {
    message: 'Name must be at least 6 characters long',
  })
  name?: string;

  /**
   * (?=.*[a-z]): The string must contain at least 1 lowercase alphabetical character.
   * (?=.*[A-Z]): The string must contain at least 1 uppercase alphabetical character.
   * (?=.*\d): The string must contain at least 1 numeric character.
   * (?=.*[@$!%*?&]): The string must contain at least one special character.
   * [A-Za-z\d@$!%*?&]{8,}: The string must be eight characters or longer.
   */
  @ApiProperty({
    type: String,
    required: false,
    description: 'The password for the protected chat',
    example: 'Password123!',
  })
  @ValidateIf((o) => o.type === $Enums.ConversationType.PROTECTED)
  @IsNotEmpty({ message: 'Password is required when chat type is protected' })
  @IsString()
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  // @Matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   {
  //     message: 'Password too weak',
  //   },
  // )
  password: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  ownerId?: number;

  @ApiProperty({
    type: [Number],
    required: false,
    description: 'The list of participants in the chat',
    example: [1, 2, 3],
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  participants: number[];
}
