import { Controller, Get, Req } from '@nestjs/common';

import { ReqJwtUser } from 'src/types';

import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}
  @Get()
  async getChats(@Req() { user }: ReqJwtUser) {
    const response = await this.chatService.getChatsByUserId(user.id);
    return response;
  }
}
