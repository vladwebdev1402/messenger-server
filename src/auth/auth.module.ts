import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JWT_SECRET } from 'src/constants';
import { UserModule } from 'src/user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, JwtModule.register(
    {
      global: true,
      secret: JWT_SECRET,
      signOptions: {
        expiresIn: "365d"
      }
    }
  )],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
