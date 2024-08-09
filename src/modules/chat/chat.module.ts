import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AuthHttpMiddleware } from 'src/utils';

import { ChatMembersModule, MessageModule } from './modules';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from '../auth';

@Module({
  imports: [MessageModule, ChatMembersModule, AuthModule],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthHttpMiddleware).forRoutes(ChatController);
  }
}
