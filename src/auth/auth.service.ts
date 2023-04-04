import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { User, Prisma } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}
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
      return this.signToken(user.email, user.id);
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
      throw new UnauthorizedException('Password incorrect');
    }
    return this.signToken(user.email, user.id);
  }

  async signToken(email: string, id: number) {
    const payload = {
      email,
      sub: id,
    };
    const jwtToken = await this.jwt.signAsync(payload, {});
    return {
      jwtToken,
    };
  }
}
