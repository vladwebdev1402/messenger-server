import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database';
import { AuthService } from '../auth';

@Injectable()
export class UserService {
  constructor(
    private databaseService: DatabaseService,
    private authService: AuthService,
  ) {}

  async setOnlineUser({
    token,
    idSocket,
  }: {
    token: string;
    idSocket: string;
  }) {
    const user = this.authService.decodeToken(token);

    await this.databaseService.connection.create({
      data: {
        idSocket,
        idUser: user.id,
      },
    });

    await this.databaseService.user.update({
      where: {
        id: user.id,
      },
      data: {
        isOnline: true,
      },
    });
  }

  async setOfflineUser(idSocket: string) {
    const userConnection = await this.databaseService.connection.delete({
      where: {
        idSocket,
      },
    });

    const countConnections = await this.databaseService.connection.count({
      where: {
        idUser: userConnection.id,
      },
    });

    if (countConnections === 0) {
      await this.databaseService.user.update({
        where: {
          id: userConnection.idUser,
        },
        data: {
          isOnline: false,
        },
      });
    }
  }

  async searchUsersByLogin(login: string) {
    // const users = await this.databaseService.user.findMany({
    //   where: {
    //     login: {
    //       contains: login,
    //     },
    //   },
    //   select: {
    //     id: true,
    //     login: true,
    //     isOnline: true,
    //   },
    // });

    const lowerLogin = `%${login.toLowerCase()}%`;
    const users = await this.databaseService.$queryRaw`
      SELECT id, login, isOnline
      FROM User
      WHERE LOWER(login) LIKE LOWER(${lowerLogin});
    `;
    return users;
  }
}
