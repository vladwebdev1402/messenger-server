import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { UserService } from './user.service';

@WebSocketGateway({cors: '*'})
export class UserGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private userService: UserService) {}
  private server: Server;

  afterInit(server: Server) {
    this.server = server;
  }

  handleConnection(client: Socket) {
    const token = client.handshake.query.token;
    this.userService.setOnlineUser({
      token: token as string,
      idSocket: client.id,
    });
  }

  handleDisconnect(client: Socket) {
    this.userService.setOfflineUser(client.id);
  }
}
