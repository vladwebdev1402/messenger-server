import { Injectable } from '@nestjs/common';

import { DatabaseService } from 'src/base';

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

    const receiverConnections = await this.databaseService.connection.findMany({
      where: {
        idUser: secondUser.id,
      },
    });
    const senderConnections = await this.databaseService.connection.findMany({
      where: {
        idUser: sendUser.id,
      },
    });

    return {
      chat,
      message,
      sender: sendUser,
      reciever: secondUser,
      receiverConnections,
      senderConnections,
    };
  }

  async getChatsByUserId(idUser: number) {
    const chats = await this.databaseService.chatMember.findMany({
      where: {
        idUser,
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
                  idUser,
                },
              },
              take: 1,
              include: {
                user: {
                  select: {
                    id: true,
                    login: true,
                    isOnline: true,
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

  async getCountConnections(idUser: number) {
    return await this.databaseService.connection.count({
      where: {
        idUser,
      },
    });
  }
}
