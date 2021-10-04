import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from 'src/users/users.service';
import * as Jwt from 'jsonwebtoken';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}
  //middleware from node nest

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req?.headers?.authorization) throw new Error('Token not found');

      let isExistToken = false;
      let reqAuth = req?.headers?.authorization.replace('Bearer ', '');
      let token: any = Jwt.verify(reqAuth, process.env.JWT_SECRET_KEY);
      let user = await this.usersService.findById(token._id);

      if (!user) throw new Error('User not exist!');

      user.tokens.forEach((element) => {
        if (element.token === reqAuth) {
          isExistToken = true;
          return;
        }

        return;
      });

      if (!isExistToken) throw new Error('Invalid Token');

      req.user = token._id;
      req.authInfo = reqAuth;

      next();
    } catch (error) {
      throw new UnauthorizedException({
        success: false,
        message: error.message,
      });
    }
  }
}
