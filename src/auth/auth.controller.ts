import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Auth } from './interfaces/Auth';
import { Validate, validate } from 'class-validator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  signInUser(@Body() userSigniInData: LoginUserDto) {
    return this.authService.signInUser(userSigniInData);
  }

  @Post('/sign-up')
  async signUpUser(@Body() userData: CreateUserDto) {
    return this.authService.signUpUser(userData);
  }

  @Get('/logout')
  logoutUser(@Req() req: Auth) {
    return this.authService.logoutUser(req.user, req.authInfo);
  }
}
