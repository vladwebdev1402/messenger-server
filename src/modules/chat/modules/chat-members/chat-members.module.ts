import { Module } from '@nestjs/common';

import { ChatMembersService } from './chat-members.service';

@Module({
  providers: [ChatMembersService],
  exports: [ChatMembersService],
})
export class ChatMembersModule {}
