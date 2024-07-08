import { Module } from '@nestjs/common';

import { ChatMembersService } from './chat-members.service';
import { DatabaseModule } from 'src/modules/database';

@Module({
  imports: [DatabaseModule],
  providers: [ChatMembersService],
  exports: [ChatMembersService],
})
export class ChatMembersModule {}
