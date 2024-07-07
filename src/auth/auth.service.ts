import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';

import { DatabaseService } from 'src/database/database.service';

import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async signUp(dto: CreateAuthDto) {
    const user = await this.databaseService.user.findFirst({
      where: {
        login: dto.login,
      },
    });

    if (user) {
      throw new BadRequestException(
        'Пользователь с таким логином уже существует',
      );
    }

    const hashPassword = hashSync(dto.password, genSaltSync(10));

    const newUser = await this.databaseService.user.create({
      data: {
        ...dto,
        password: hashPassword,
      },
    });

    return { login: newUser.login };
  }

  async signIn(dto: CreateAuthDto) {
    const user = await this.databaseService.user.findFirst({
      where: {
        login: dto.login,
      },
    });

    if (!user) {
      throw new BadRequestException(
        'Пользователь с таким логином не был найден',
      );
    }

    if (!compareSync(dto.password, user.password)) {
      throw new UnauthorizedException('Пароли не совпадают');
    }

    const token = this.jwtService.sign({ id: user.id, login: user.login });

    return { token: token };
  }
}
