import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {}

  async getUserById(id: number) {
    const user = await this.databaseService.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    return { login: user.login };
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
}
