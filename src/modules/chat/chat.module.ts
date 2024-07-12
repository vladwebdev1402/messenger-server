import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database';
import { ChatMembersModule, MessageModule } from './modules';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from '../auth';

@Module({
  imports: [MessageModule, DatabaseModule, ChatMembersModule, AuthModule],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
