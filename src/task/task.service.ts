import { Model } from 'mongoose';
import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './interfaces/Task';
@Injectable()
export class TaskService {
  constructor(@InjectModel('Task') private readonly taskModel: Model<Task>) {}

  async getTasks(userId: string) {
    try {
      return await this.taskModel.find({ userId });
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: error?.message,
      });
    }
  }

  async getTask(userId: string, taskId: string) {
    try {
      let tasks = await this.taskModel.find({ _id: taskId, userId });
      if (!tasks || tasks.length === 0) throw new Error('Task Not found');

      return {
        success: true,
        body: { tasks },
      };
    } catch (error) {
      throw new NotFoundException({
        success: false,
        message: error?.message,
      });
    }
  }

  async createTask(task: CreateTaskDto, userId: string) {
    try {
      let createTaskVar = new this.taskModel({ ...task, userId });
      return await createTaskVar.save();
    } catch (error) {
      throw new NotAcceptableException({
        success: false,
        message: error?.message,
      });
    }
  }

  async putTask(userId: string, _id: string, objReplace: object) {
    try {
      let taskUser: any = await this.taskModel.findById(_id);
      let userString = taskUser?.userId?.toString();

      if (userId !== userString) throw new Error('your not main user');

      return await this.taskModel.findByIdAndUpdate(_id, objReplace, {
        new: true,
      });
    } catch (error) {
      throw new NotAcceptableException({
        success: false,
        message: error?.message,
      });
    }
  }

  async deleteOneTask(userId: string, _id: string) {
    try {
      let taskUser: any = await this.taskModel.findById(_id);
      let userString = taskUser?.userId?.toString();

      if (userId !== userString) throw new Error('your not main user');

      await this.taskModel.findByIdAndDelete(_id);
      return {
        success: true,
        body: { message: 'Task has been delete' },
      };
    } catch (error) {
      throw new NotAcceptableException({
        success: false,
        message: error?.message,
      });
    }
  }

  async deleteAllTask() {
    try {
      return await this.taskModel.deleteMany();
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: error?.message,
      });
    }
  }

  async searchTask(userId: string, searchWord: string, query: any) {
    try {
      let regex = new RegExp(searchWord, 'i');
      let filter = {
        userId: userId,
        $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }],
      };
      let skip: number = parseInt(query['offset']) || 0;
      let limit: number = parseInt(query['limit']) || 0;

      let total = await this.taskModel.countDocuments(filter);
      let tasks = await this.taskModel.find(filter).skip(skip).limit(limit);

      return {
        success: true,
        body: { total, tasks },
      };
    } catch (error) {
      throw new NotFoundException({
        sucess: false,
        message: error?.message,
      });
    }
  }
}
