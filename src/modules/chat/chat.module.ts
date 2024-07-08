import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

import { JWT_SECRET } from 'src/constants';

import { DatabaseModule } from '../database';
import { ChatMembersModule, MessageModule } from './modules';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: {
        expiresIn: '365d',
      },
    }),
    MessageModule,
    DatabaseModule,
    ChatMembersModule,
  ],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
