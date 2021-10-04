import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateUser, SignIn } from './interfaces/Auth';
import { CreateUserDto } from './dto/create-user.dto';
import { validate } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersServices: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signInUser({ email, password }: SignIn) {
    try {
      let user = await this.usersServices.findOne(email);
      let { _id } = user;
      let comparePassword = await bcrypt.compare(password, user?.password);

      if (!comparePassword) throw new Error('Password not match');

      let createJwtToken = await this.jwtService.signAsync({ _id, email });

      return await this.usersServices.saveToken(_id, createJwtToken);
    } catch (error) {
      throw new UnauthorizedException({
        success: false,
        message: error?.message,
      });
    }
  }

  async signUpUser(userData: CreateUser) {
    try {
      // Validacion con validator de la informacion deacuerdo al Create User DTO
      let data = new CreateUserDto();
      let keys = Object.keys(userData);
      keys.map((item) => (data[item] = userData[item]));
      let error: any = await validate(data);

      if (error.length > 0) throw new Error(error[0]);

      //Validacion y creacriond de la contraseña
      let encryPass = await bcrypt.hash(userData?.password, 10);
      let user = {
        ...userData,
        password: encryPass,
      };
      return await this.usersServices.CreateUser(user);
    } catch (error) {
      throw new BadRequestException({ success: false, message: error.message });
    }
  }

  async logoutUser(_id: string, token: string) {
    try {
      let user = await this.usersServices.findById(_id);
      let filterToken: any = user.tokens.filter((item) => item.token !== token);

      user.tokens = filterToken;
      return await this.usersServices.logoutUser(_id, user);
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: error?.message,
      });
    }
  }
}
