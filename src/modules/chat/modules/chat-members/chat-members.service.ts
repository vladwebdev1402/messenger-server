import { Injectable } from '@nestjs/common';

import { DatabaseService } from 'src/base';

@Injectable()
export class ChatMembersService {
  constructor(private databaseService: DatabaseService) {}

  async createChatMember(data: { idChat: number; idUser: number }) {
    return await this.databaseService.chatMember.create({
      data: {
        idChat: data.idChat,
        idUser: data.idUser,
      },
    });
  }
}
