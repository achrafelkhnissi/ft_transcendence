import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule] ,
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
