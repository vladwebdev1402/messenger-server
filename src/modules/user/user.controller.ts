import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/:id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const {
      id: userId,
      isOnline,
      login,
    } = await this.userService.getUserById(id);
    return {
      id: userId,
      isOnline,
      login,
    };
  }
}
