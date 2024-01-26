import { ConversationType } from '@prisma/client';

export interface ChatData {
  type: ConversationType;
  name: string;
  participants: { connect: { id: number }[] };
  owner?: { connect: { id: number } };
  password?: string;
  image?: string;
}
