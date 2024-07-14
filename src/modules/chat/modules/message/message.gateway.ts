import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

import { EVENTS } from 'src/constants';

import { CreateMessageTokenDto } from './dto';
import { MessageService } from './message.service';

@WebSocketGateway()
export class MessageGateway {
  constructor(private messageService: MessageService) {}
  private server: Server;

  afterInit(server: Server) {
    this.server = server;
  }

  @SubscribeMessage(EVENTS.messageSend)
  async createMessage(@MessageBody() data: CreateMessageTokenDto) {
    const message = await this.messageService.createMessageWithToken(data);
    this.server.to('chat/' + data.idChat).emit(EVENTS.messageReceive, message);
  }
}
