import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { ReqUser } from 'src/auth/decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  @Get('profile')
  getProfile(@ReqUser() user: User) {
    return user;
  }
}
