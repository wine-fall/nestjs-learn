import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private autchService: AuthService) {}

    @Post('hello/world')
    helloWorld() {
      return {
        msg: 'hello world!',
      };
    }

  @Post('signup')
  signup() {
    return 'signup';
  }

  @Post('signin')
  signin() {
    return 'signin';
  }
}
