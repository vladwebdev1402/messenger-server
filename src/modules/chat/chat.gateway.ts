import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { CreateChatDto, JoinChatDto } from './dto';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit {
  constructor(private chatService: ChatService) {}
  private server: Server;

  afterInit(server: Server) {
    this.server = server;
  }

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

  @SubscribeMessage('chat/join')
  async joinRoom(
    @MessageBody() data: JoinChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.join('chat/' + data.idChat);
    this.server.to('chat/' + data.idChat).emit('chat/connect', data.idUser);
  }

  @SubscribeMessage('chat/leave')
  async leaveRoom(
    @MessageBody() data: JoinChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.leave('chat/' + data.idChat);
    this.server.to('chat/' + data.idChat).emit('chat/disconnect', data.idUser);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    const rooms = socket.rooms;
  }
}
