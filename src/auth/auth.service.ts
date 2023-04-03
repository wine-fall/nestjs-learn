import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  helloWorld() {
    return {
      msg: 'hello world!',
    };
  }
  signup() {
    return {
      msg: 'signup',
    };
  }
  signin() {
    return {
      msg: 'signin',
    };
  }
}
