import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { CreateChatDto } from './dto';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway {
  constructor(private chatService: ChatService) {}

  @SubscribeMessage('chat/private/create')
  async handleEvent(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { chat, message, secondIdSocket } =
      await this.chatService.createPrivateChat(data);
    socket.emit('chat/private/create', { chat, message });
    socket.to(secondIdSocket).emit('message/receive', { message });
  }
}
