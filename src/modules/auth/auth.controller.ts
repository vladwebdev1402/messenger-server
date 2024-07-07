import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() dto: CreateAuthDto) {
    const response = await this.authService.signUp(dto);
    return response;
  }

  @Post('/signin')
  async signIn(@Body() dto: CreateAuthDto) {
    const response = await this.authService.signIn(dto);
    return response;
  }
}
