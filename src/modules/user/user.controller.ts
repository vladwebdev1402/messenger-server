import { Controller, Get, Headers } from '@nestjs/common';

import { AuthService } from '../auth';

@Controller('user')
export class UserController {
  constructor(private authService: AuthService) {}

  @Get()
  async getUser(@Headers() headers: {authorization: string}) {

    const token = headers.authorization;
    const user = this.authService.decodeToken(token);

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
}
