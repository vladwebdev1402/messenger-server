import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtUser } from 'src/types';

import { DatabaseService } from '../database';
import { UserService } from '../user';
import { CreateChatDto } from './dto';
import { ChatMembersService, MessageService } from './modules';

@Injectable()
export class ChatService {
  constructor(
    private userService: UserService,
    private databaseService: DatabaseService,
    private messageService: MessageService,
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

    const message = await this.messageService.createMessageWithoutToken({
      idChat: chat.id,
      idUser: sendUser.id,
      message: data.messsage,
    });

    const secondUser = await this.userService.getUserById(data.idSecondUser);

    return { chat, message, secondIdSocket: secondUser.idSocket };
  }
}
