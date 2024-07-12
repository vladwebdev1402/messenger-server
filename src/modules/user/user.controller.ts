import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { AuthService } from '../auth';

@Controller('user')
export class UserController {
  constructor(private authService: AuthService) {}

  @Get('/:id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const {
      id: userId,
      isOnline,
      login,
    } = await this.authService.getUserById(id);
    return {
      id: userId,
      isOnline,
      login,
    };
  }
}
