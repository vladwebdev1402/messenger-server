import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserGateway } from './user.gateway';
import { ChatModule } from '../chat';
import { AuthModule } from '../auth';

@Module({
  imports: [
    DatabaseModule,
    ChatModule,
    AuthModule,
  ],
  providers: [UserService, UserGateway],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
