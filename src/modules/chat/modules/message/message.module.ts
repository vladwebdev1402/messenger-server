import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AuthModule } from 'src/modules/auth';
import { AuthHttpMiddleware } from 'src/utils';

import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';

@Module({
  imports: [AuthModule],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway],
  exports: [MessageService],
})
export class MessageModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthHttpMiddleware).forRoutes(MessageController);
  }
}
