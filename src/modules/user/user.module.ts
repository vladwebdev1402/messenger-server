import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthHttpMiddleware } from 'src/utils';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserGateway } from './user.gateway';
import { ChatModule } from '../chat';
import { AuthModule } from '../auth';

@Module({
  imports: [ChatModule, AuthModule],
  providers: [UserService, UserGateway],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthHttpMiddleware).forRoutes(UserController);
  }
}
