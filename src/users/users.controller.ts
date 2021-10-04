import { Controller, Get, Delete, Req, Put, Body } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './interfaces/Users';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUser(@Req() req: Users) {
    return this.usersService.getUser(req?.user);
  }

  @Put()
  updateUser(@Body() body: UpdateUserDto, @Req() req: Users) {
    return this.usersService.updateUser(req.user, body);
  }

  @Delete()
  deleteUser(@Req() req: Users) {
    return this.usersService.deleteUser(req.user);
  }
}
