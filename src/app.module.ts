import { Module } from '@nestjs/common';

import { AuthModule, ChatModule, DatabaseModule, UserModule } from './modules';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
