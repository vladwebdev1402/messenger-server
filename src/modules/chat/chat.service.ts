import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database';
import { CreateChatDto } from './dto';
import { ChatMembersService, MessageService } from './modules';
import { AuthService } from '../auth';

@Injectable()
export class ChatService {
  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService,
    private messageService: MessageService,
    private chatMembersService: ChatMembersService,
  ) {}

  async createPrivateChat(data: CreateChatDto) {
    const sendUser = this.authService.decodeToken(data.token);
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
      message: data.message,
    });

    const secondUser = await this.authService.getUserById(data.idSecondUser);

    return { chat, message, sender: sendUser, reciever: secondUser };
  }

  async getChatsByUserId(token: string, includeIdSocket = false) {
    const user = this.authService.decodeToken(token);

    const chats = await this.databaseService.chatMember.findMany({
      where: {
        idUser: user.id,
      },
      include: {
        chat: {
          select: {
            id: true,
            isGroup: true,
            name: true,
            messages: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
            },
            members: {
              where: {
                NOT: {
                  idUser: user.id,
                },
              },
              take: 1,
              include: {
                user: {
                  select: {
                    id: true,
                    login: true,
                    isOnline: true,
                    idSocket: includeIdSocket,
                  },
                },
              },
            },
          },
        },
      },
    });

    const transformChats = chats.map((item) => ({
      chat: { ...item.chat, members: null, messages: null },
      user: { ...item.chat.members[0].user },
      lastMessage: item.chat.messages[0],
    }));

    return transformChats;
  }
}
