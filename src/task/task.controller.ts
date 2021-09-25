import {
 Body,
 Controller,
 Delete,
 Get,
 Param,
 Post,
 Put,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './interfaces/Task';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
 constructor(private readonly taskService: TaskService) {}

 @Get(':taskId')
 getTask(@Param('taskId') taskId: string): Promise<Task> {
  return this.taskService.getTask(taskId);
 }

 @Get()
 getTasks(): Promise<Task[]> {
  return this.taskService.getTasks();
 }

 @Put(':taskId')
 putTask(@Param('taskId') taskId: string, @Body() updateTask: object) {
  return this.taskService.putTask(taskId, updateTask);
 }

 @Post()
 createTask(@Body() task: CreateTaskDto) {
  return this.taskService.createTask(task);
 }

 @Delete(':taskId')
 deleteOneTask(@Param('taskId') taskId: string) {
  return this.taskService.deleteOneTask(taskId);
 }

 @Delete()
 deleteAllTask() {
  return this.taskService.deleteAllTask();
 }
}
