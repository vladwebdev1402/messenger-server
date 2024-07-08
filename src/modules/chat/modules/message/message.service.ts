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
}
