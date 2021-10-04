import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './common/logger.middleware';
import { UsersController } from './users/users.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TaskController } from './task/task.controller';

@Module({
  imports: [
    AuthModule,
    TaskModule,
    UsersModule,
    ConfigModule.forRoot({
      expandVariables: true,
    }),
    MongooseModule.forRoot('mongodb://localhost/nest-task-mongo', {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(TaskController, UsersController, {
        path: '/auth/logout',
        method: RequestMethod.ALL,
      });
  }
}
