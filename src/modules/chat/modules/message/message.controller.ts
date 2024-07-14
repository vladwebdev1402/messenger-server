import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';

import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get('/:id')
  async getMessagesByChatId(
    @Param('id', ParseIntPipe) id: number,
    @Query('length', new ParseIntPipe({optional: true})) length?: number,
  ) {
    const messages = await this.messageService.getMessagesByChatId(id, length);
    return messages;
  }
}
