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
  ) {
    const {
      chat,
      message,
      sender,
      reciever,
      receiverConnections,
      senderConnections,
    } = await this.chatService.createPrivateChat(data);

    senderConnections.forEach((connection) =>
      this.server.to(connection.idSocket).emit(EVENTS.chatPrivateCreate, {
        user: reciever,
        chat,
        message,
        creator: true,
      }),
    );

    receiverConnections.forEach((connection) =>
      this.server.to(connection.idSocket).emit(EVENTS.chatPrivateCreate, {
        user: sender,
        chat,
        message,
        creator: false,
      }),
    );
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

    const countConnections = await this.chatService.getCountConnections(
      data.idUser,
    );

    if (countConnections === 1) {
      this.server
        .to('chat/' + data.idChat)
        .emit(EVENTS.chatDisconnect, data.idUser);
    }
  }
}
