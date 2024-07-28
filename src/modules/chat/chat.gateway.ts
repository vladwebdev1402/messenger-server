import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { EVENTS } from 'src/constants';

import { CreateChatDto, JoinChatDto } from './dto';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit {
  constructor(private chatService: ChatService) {}
  private server: Server;

  afterInit(server: Server) {
    this.server = server;
  }

  @SubscribeMessage(EVENTS.chatPrivateCreate)
  async handleEvent(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { chat, message, sender, reciever } =
      await this.chatService.createPrivateChat(data);

      this.server.to(socket.id).emit(EVENTS.chatPrivateCreate, {
      user: reciever,
      chat,
      message,
      creator: true,
    });
    this.server.to(reciever.idSocket).emit(EVENTS.chatPrivateCreate, {
      user: sender,
      chat,
      message,
      creator: false,
    });
  }

  @SubscribeMessage(EVENTS.chatJoin)
  async joinRoom(
    @MessageBody() data: JoinChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.join('chat/' + data.idChat);
    this.server.to('chat/' + data.idChat).emit(EVENTS.chatConnect, data.idUser);
  }

  @SubscribeMessage(EVENTS.chatLeave)
  async leaveRoom(
    @MessageBody() data: JoinChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.leave('chat/' + data.idChat);
    this.server
      .to('chat/' + data.idChat)
      .emit(EVENTS.chatDisconnect, data.idUser);
  }
}
