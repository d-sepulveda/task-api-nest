import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
 imports: [
  TaskModule,
  UsersModule,
  MongooseModule.forRoot('mongodb://localhost/nest-task-mongo', {
   useNewUrlParser: true,
   useFindAndModify: false,
   useCreateIndex: true,
  }),
 ],
 controllers: [AppController],
 providers: [AppService],
})
export class AppModule {}
