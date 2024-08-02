import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';

import { JwtUser } from 'src/types';

import { CreateAuthDto } from './dto/create-auth.dto';
import { DatabaseService } from '../database';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private databaseService: DatabaseService,
  ) {}

  decodeToken(token: string) {
    const bearerToken = token.split(' ')[1];
    if (!token || typeof token !== 'string')
      throw new UnauthorizedException('Пользователь не авторизован');
    const user = new Object(this.jwtService.decode(bearerToken));
    if (user.hasOwnProperty('id') && user.hasOwnProperty('login'))
      return user as JwtUser;
    throw new UnauthorizedException('Пользователь не авторизован');
  }

  async getUserById(id: number) {
    const user = await this.databaseService.user.findFirst({
      where: {
        id,
      },
      select: {
        login: true,
        isOnline: true,
        id: true,
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

  async signUp(dto: CreateAuthDto) {
    const user = await this.getUserByLogin(dto.login, true);

    if (user) {
      throw new BadRequestException(
        'Пользователь с таким логином уже существует',
      );
    }

    const hashPassword = hashSync(dto.password, genSaltSync(10));

    const newUser = await this.createUser({
      ...dto,
      password: hashPassword,
    });

    return { login: newUser.login };
  }

  async signIn(dto: CreateAuthDto) {
    const user = await this.getUserByLogin(dto.login);

    if (!compareSync(dto.password, user.password)) {
      throw new UnauthorizedException('Пароли не совпадают');
    }

    const token = this.jwtService.sign({ id: user.id, login: user.login });

    return { token: token };
  }
}
