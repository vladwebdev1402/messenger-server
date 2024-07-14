import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/modules/database';
import { AuthModule } from 'src/modules/auth';

import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway],
  exports: [MessageService],
})
export class MessageModule {}
