import { ConversationType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateChatDto {
  readonly id: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  readonly name: string;

  // TODO: add user 2 as participant of chat or add multiple participants? idk
  @IsNumber()
  @IsNotEmpty()
  readonly ownerId: number;

  @IsEnum(ConversationType)
  @IsNotEmpty()
  readonly type: ConversationType;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  constructor(data: Partial<CreateChatDto>) {
    Object.assign(this, data);
  }
}
