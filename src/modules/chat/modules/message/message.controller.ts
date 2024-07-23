import {
  Controller,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get('/:id')
  async getMessagesByChatId(
    @Headers() headers: { authorization: string },
    @Param('id', ParseIntPipe) id: number,
    @Query('length', new ParseIntPipe({ optional: true })) length?: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
  ) {
    const messages = await this.messageService.getMessagesByChatId(
      id,
      length,
      page,
      headers.authorization,
    );
    return messages;
  }
}
