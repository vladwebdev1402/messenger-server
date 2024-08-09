import { Injectable } from '@nestjs/common';

import { AuthService } from 'src/modules/auth';
import { DatabaseService } from 'src/base';

import { CreateMessageDto, CreateMessageTokenDto } from './dto';

@Injectable()
export class MessageService {
  constructor(
    private databaseService: DatabaseService,
    private authService: AuthService,
  ) {}

  async createMessageWithoutToken(data: CreateMessageDto) {
    const message = await this.databaseService.message.create({
      data,
      include: {
        user: true,
      },
    });

    return message;
  }

  async createMessageWithToken({ token, ...data }: CreateMessageTokenDto) {
    const user = this.authService.decodeToken(token);

    const message = await this.databaseService.message.create({
      data: {
        ...data,
        idUser: user.id,
      },
      include: {
        user: {
          select: {
            login: true,
            isOnline: true,
            id: true,
          },
        },
      },
    });

    return message;
  }

  async getMessagesByChatId(id: number, length = 20, page = 1) {
    const messages = await this.databaseService.message.findMany({
      where: {
        idChat: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * length,
      take: length,
      include: {
        user: {
          select: {
            id: true,
            isOnline: true,
            login: true,
          },
        },
      },
    });

    const countMessages = await this.databaseService.message.count({
      where: {
        idChat: id,
      },
    });

    return {
      messages: messages.reverse(),
      nextCursor:
        (page + 1) * length > countMessages
          ? null
          : {
              page: page + 1,
              length,
            },
    };
  }
}
