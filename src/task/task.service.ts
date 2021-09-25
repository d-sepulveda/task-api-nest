import { Model } from 'mongoose';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './interfaces/Task';

@Injectable()
export class TaskService {
 constructor(@InjectModel('Task') private readonly taskModel: Model<Task>) {}

 async getTasks(): Promise<Task[]> {
  try {
   return await this.taskModel.find();
  } catch (error) {
   throw new HttpException(error?.message, 500);
  }
 }

 async getTask(taskId: string): Promise<Task> {
  try {
   return this.taskModel.findOne({ id: parseInt(taskId) });
  } catch (error) {
   throw new HttpException(error?.message, 500);
  }
 }

 async createTask(task: CreateTaskDto) {
  try {
   let createTaskVar = new this.taskModel(task);
   return await createTaskVar.save();
  } catch (error) {
   throw new HttpException(error?.message, 406);
  }
 }

 async putTask(taskId: string, objReplace: object) {
  console.log(taskId);
  try {
   return await this.taskModel.findOneAndUpdate(
    { id: parseInt(taskId) },
    objReplace,
   );
  } catch (error) {
   throw new HttpException(error?.message, 406);
  }
 }

 async deleteOneTask(taskId: string) {
  try {
   return this.taskModel.findOneAndDelete({ id: parseInt(taskId) });
  } catch (error) {
   throw new HttpException(error?.message, 406);
  }
 }

 async deleteAllTask() {
  try {
   return await this.taskModel.deleteMany();
  } catch (error) {
   throw new HttpException(error?.message, 500);
  }
 }
}
