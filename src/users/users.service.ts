import { Model } from 'mongoose';
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersDocument } from './schemas/users.schema';
import { JwtService } from '@nestjs/jwt';
import { UpdateUser } from './interfaces/Users';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { validate } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private usersModel: Model<UsersDocument>,
    private jwtService: JwtService,
  ) {}

  async findById(_id: string) {
    return await this.usersModel.findById(_id);
  }

  async findOne(email: string) {
    return await this.usersModel.findOne({ email });
  }

  async getUser(UserId: string) {
    try {
      let user: any = await this.usersModel.findById(UserId);
      let { _id, name, email } = user;

      return {
        success: true,
        body: { _id, name, email },
      };
    } catch (error) {
      throw new BadRequestException({
        success: false,
        message: error?.message,
      });
    }
  }

  async updateUser(userId: string, objectUpdate: UpdateUser) {
    let user = await this.usersModel.findById(userId);
    let keys = Object.keys(objectUpdate);
    keys.map((element) => (user[element] = objectUpdate[element]));
    let body = await this.usersModel.findByIdAndUpdate(userId, user, {
      new: true,
    });
    return {
      success: true,
      body: {
        name: body?.name,
        email: body?.email,
      },
    };
  }

  async logoutUser(_id: string, user: object) {
    await this.usersModel.findByIdAndUpdate(_id, user, { new: true });

    return {
      success: true,
      body: {
        message: 'User has been close his session',
      },
    };
  }

  async saveToken(_id: string, token: string) {
    try {
      let user: any = await this.usersModel.findById(_id);
      user.tokens = user.tokens.concat({ token });

      if (user.tokens.length > 4) new Error('Demasiadas cuentas abiertas');

      let newUserData = new this.usersModel(user);
      await newUserData.save();
      return { success: true, body: { token } };
    } catch (error) {
      throw new UnauthorizedException({
        success: false,
        message: error?.message,
      });
    }
  }

  async CreateUser(createUserData: any) {
    let data = new CreateUserDto()
    let keys = Object.keys(createUserData)
    keys.map(item => data[item] = createUserData[item])
    let error:any = await validate(data)
    if(error.length > 0) throw new Error(error[0])

    let user = new this.usersModel(createUserData);
    
    let userSave = await user.save();
    let token = await this.jwtService.signAsync({
      _id: userSave._id,
      email: userSave.email,
    });
    userSave.tokens[0] = { token };

    let userCompleteData = new this.usersModel(userSave);
    let body = await userCompleteData.save();
    return { success: true, body };
  }

  async deleteUser(_id: string) {
    let body = await this.usersModel.findByIdAndDelete(_id);
    return { success: true, body };
  }
}
