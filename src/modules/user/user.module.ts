import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JWT_SECRET } from 'src/constants';

import { DatabaseModule } from '../database';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserGateway } from './user.gateway';

@Module({
  imports: [DatabaseModule, JwtModule.register(
    {
      global: true,
      secret: JWT_SECRET,
      signOptions: {
        expiresIn: "365d"
      }
    }
  )],
  providers: [UserService, UserGateway],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
