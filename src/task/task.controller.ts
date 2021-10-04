import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './interfaces/Task';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get(':taskId')
  getTask(@Param('taskId') taskId: string, @Req() req) {
    return this.taskService.getTask(req.user, taskId);
  }

  @Get()
  getTasks(@Req() req): Promise<Task[]> {
    return this.taskService.getTasks(req.user);
  }

  @Put(':taskId')
  putTask(
    @Param('taskId') taskId: string,
    @Body() updateTask: object,
    @Req() req,
  ) {
    return this.taskService.putTask(req.user, taskId, updateTask);
  }

  @Post('/search')
  searchTask(@Body() body, @Req() req) {
    return this.taskService.searchTask(req.user, body.word, req.query);
  }

  @Post()
  createTask(@Body() task: CreateTaskDto, @Req() req: object) {
    let { user }: any = req;
    return this.taskService.createTask(task, user);
  }

  @Delete(':taskId')
  deleteOneTask(@Param('taskId') taskId: string, @Req() req) {
    return this.taskService.deleteOneTask(req?.user, taskId);
  }

  @Delete()
  deleteAllTask() {
    return this.taskService.deleteAllTask();
  }
}
