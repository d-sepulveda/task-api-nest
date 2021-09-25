import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUser() {
    return this.usersService.getUser();
  }

  @Post()
  createUser(@Body() userData: CreateUserDto) {
    return this.usersService.CreateUser(userData)
  }
}
