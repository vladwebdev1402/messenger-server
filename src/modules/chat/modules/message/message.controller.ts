import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get('/:id')
  async getMessagesByChatId(@Param('id', ParseIntPipe) id: number) {
    const messages = await this.messageService.getMessagesByChatId(id);
    return messages;
  }
}
