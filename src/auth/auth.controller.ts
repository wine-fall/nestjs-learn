import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private autchService: AuthService) {}

  @Post('hello/world')
  helloWorld() {
    return this.autchService.helloWorld();
  }

  @Post('signup')
  signup() {
    return this.autchService.signup();
  }

  @Post('signin')
  signin() {
    return this.autchService.signin();
  }
}
