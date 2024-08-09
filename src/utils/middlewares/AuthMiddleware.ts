import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

import { JwtUser } from 'src/types';

@Injectable()
export class AuthHttpMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, _: Response, next: NextFunction) {
    const header = req.headers['authorization'];

    if (!header) {
      throw new UnauthorizedException('Не предоставлен заголовок авторизации');
    }

    const token = header.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Токен авторизации не предоставлен');
    }

    try {
      const user = this.jwtService.verify<JwtUser>(token);
      req['user'] = user;
      next();
    } catch {
      throw new UnauthorizedException('Предоставлен неверный токен');
    }
  }
}

export class AuthGatewayMiddleware {}
