import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database';
import { ChatService } from '../chat/chat.service';
import { AuthService } from '../auth';

@Injectable()
export class UserService {
  constructor(
    private databaseService: DatabaseService,
    private chatService: ChatService,
    private authService: AuthService,
  ) {}

  async setOnlineUser({
    token,
    idSocket,
  }: {
    token: string;
    idSocket: string | null;
  }) {
    try {
      const user = this.authService.decodeToken(token);

      await this.databaseService.user.update({
        where: {
          id: user.id,
        },
        data: {
          isOnline: true,
          idSocket: idSocket,
        },
      });

      const frendly = await this.chatService.getChatsByUserId(token, true);
      return frendly;
    } catch (error) {
      console.error(error);
      // Обработка ошибки
    }
  }

  async setOfflineUser(idSocket: string) {
    await this.databaseService.user.update({
      where: {
        idSocket: idSocket,
      },
      data: {
        idSocket: null,
        isOnline: false,
      },
    });
  }
}
