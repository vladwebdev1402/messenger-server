import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


import { DatabaseService } from '../database';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async getUserById(id: number) {
    const user = await this.databaseService.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    return { ...user };
  }

  async getUserByLogin(login: string, isSignUp = false) {
    const user = await this.databaseService.user.findFirst({
      where: {
        login,
      },
    });

    if (!user && !isSignUp) {
      throw new BadRequestException('Пользователь с таким логином не найден');
    }

    return user;
  }

  async createUser(data: CreateUserDto) {
    const user = await this.databaseService.user.create({
      data,
    });

    return user;
  }

  async setOnlineUser({
    token,
    idSocket,
  }: {
    token: string;
    idSocket: string | null;
  }) {
    try {
      if (!token || typeof token !== 'string')
        throw new UnauthorizedException('Пользователь не авторизован');

      const user = this.jwtService.decode<{ id: number; login: string }>(token);

      await this.databaseService.user.update({
        where: {
          id: user.id,
        },
        data: {
          isOnline: true,
          idSocket: idSocket,
        },
      });
    } catch (error) {
      console.error(error);
      // Обработка ошибки
    }
  }

  async setOfflineUser(idSocket: string) {
    await this.databaseService.user.update({
      where: {
        idSocket: idSocket,
      },
      data: {
        idSocket: null,
        isOnline: false,
      },
    });
  }
}
