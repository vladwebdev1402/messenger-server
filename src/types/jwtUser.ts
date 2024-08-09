import { Request } from 'express';

export type JwtUser = {
  id: number;
  login: string;
};

export type ReqJwtUser = {
  user: JwtUser;
} & Request;
