import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersDocument } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('Users') private  usersModel: Model<UsersDocument>) {}

  getUser() {
    return 'Message from service';
  }

  async CreateUser(createUserData: CreateUserDto) {
    let user = new this.usersModel(createUserData)
    return await user.save()
  }
}
