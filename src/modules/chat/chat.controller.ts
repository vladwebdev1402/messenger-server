import { Controller, Get, Headers } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}
  @Get()
  async getChats(@Headers() headers: { authorization: string }) {
    const token = headers.authorization;
    const response = await this.chatService.getChatsByUserId(token);
    return response;
  }
}
