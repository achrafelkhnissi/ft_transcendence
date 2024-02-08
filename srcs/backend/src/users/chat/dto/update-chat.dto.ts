import { PartialType } from '@nestjs/mapped-types';
import { CreateChatDto } from './create-chat.dto';
import { $Enums } from '@prisma/client';
import { ValidateIf } from 'class-validator';

export class UpdateChatDto extends PartialType(CreateChatDto) {
  @ValidateIf((o) => o.type === $Enums.ConversationType.PROTECTED, {
    message: 'Password is required when chat type is protected',
  })
  password: string;
}
