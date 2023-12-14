import { ChatType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateChatDto {
  readonly id: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  // TODO: add user 2 as participant of chat or add multiple participants? idk
  @IsNumber()
  @IsNotEmpty()
  readonly ownerId: number;

  @IsEnum(ChatType)
  @IsNotEmpty()
  readonly type: ChatType;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  constructor(data: Partial<CreateChatDto>) {
    Object.assign(this, data);
  }
}
