import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { User, Prisma } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  helloWorld() {
    return {
      msg: 'hello world!',
    };
  }
  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    try {
      const user: User = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      delete user.hash;
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Confidential incorrect');
        }
      }
      throw error;
    }
  }
  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Can not find user');
    }
    const pwMatch = await argon.verify(user.hash, dto.password);
    if (!pwMatch) {
      throw new ForbiddenException('Password incorrect');
    }
    return user;
  }
}
