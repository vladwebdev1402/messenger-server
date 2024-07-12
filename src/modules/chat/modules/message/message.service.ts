import { Injectable } from '@nestjs/common';

import { DatabaseService } from 'src/modules/database';
import { CreateMessageDto } from './dto';

@Injectable()
export class MessageService {
  constructor(private databaseService: DatabaseService) {}

  async createMessageWithoutToken(data: CreateMessageDto) {
    const message = await this.databaseService.message.create({
      data,
    });

    return message;
  }

  async getMessagesByChatId(id: number) {
    const messages = await this.databaseService.message.findMany({
      where: {
        idChat: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return messages;
  }
}
