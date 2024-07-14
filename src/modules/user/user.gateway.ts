import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket} from 'socket.io';

import { UserService } from './user.service';

@WebSocketGateway({ cors: '*' })
export class UserGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private userService: UserService) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.query.token || client.handshake.headers.token;
     await this.userService.setOnlineUser({
      token: token as string,
      idSocket: client.id,
    })  
  }

  handleDisconnect(client: Socket) {
    this.userService.setOfflineUser(client.id);
  }
}
