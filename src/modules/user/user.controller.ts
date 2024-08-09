import { Controller, Get, Query, Req } from '@nestjs/common';

import { ReqJwtUser } from 'src/types';

import { AuthService } from '../auth';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Get()
  async getUser(@Req() { user }: ReqJwtUser) {
    const {
      id: userId,
      isOnline,
      login,
    } = await this.authService.getUserById(user.id);
    return {
      id: userId,
      isOnline,
      login,
    };
  }

  @Get('/search')
  async getSearchUsers(@Query('login') login: string) {
    const users = await this.userService.searchUsersByLogin(login);
    return users;
  }
}
