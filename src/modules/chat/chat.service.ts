import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtUser } from 'src/types';

import { DatabaseService } from '../database';
import { CreateChatDto } from './dto';
import { ChatMembersService } from './modules';

@Injectable()
export class ChatService {
  constructor(
    private databaseService: DatabaseService,
    private chatMembersService: ChatMembersService,
    private jwtService: JwtService,
  ) {}

  async createPrivateChat(data: CreateChatDto) {
    const sendUser = this.jwtService.decode<JwtUser>(data.token);

    const chat = await this.databaseService.chat.create({
      data: {
        isGroup: false,
        name: sendUser.login,
      },
    });

    await this.chatMembersService.createChatMember({
      idChat: chat.id,
      idUser: sendUser.id,
    });

    await this.chatMembersService.createChatMember({
      idChat: chat.id,
      idUser: data.idSecondUser,
    });

    return chat;
  }
}
