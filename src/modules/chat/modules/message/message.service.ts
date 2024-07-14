import { Injectable } from '@nestjs/common';

import { DatabaseService } from 'src/modules/database';
import { AuthService } from 'src/modules/auth';

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

  async getMessagesByChatId(id: number, length = 20) {
    const messages = await this.databaseService.message.findMany({
      where: {
        idChat: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: length > 20 ? length : 0,
      take: 20,
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
      nextCursor: length + 20 > countMessages ? null : length + 20,
    };
  }
}
