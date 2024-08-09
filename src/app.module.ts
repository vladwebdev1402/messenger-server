import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthModule, ChatModule, UserModule } from './modules';
import { DatabaseModule } from './base';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JWT_SECRET } from './constants';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: {
        expiresIn: '365d',
      },
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
