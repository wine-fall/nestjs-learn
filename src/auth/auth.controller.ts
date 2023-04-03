import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private autchService: AuthService) {}

  @Post('hello/world')
  helloWorld() {
    return this.autchService.helloWorld();
  }

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.autchService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.autchService.signin(dto);
  }
}
