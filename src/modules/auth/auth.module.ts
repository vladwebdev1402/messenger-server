import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JWT_SECRET } from 'src/constants';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from '../database';

@Module({
  imports: [ DatabaseModule, JwtModule.register(
    {
      global: true,
      secret: JWT_SECRET,
      signOptions: {
        expiresIn: "365d"
      }
    }
  )],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
