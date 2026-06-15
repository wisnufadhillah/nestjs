import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { CurrentUser } from '../auth/auth.types';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @GetCurrentUser() user: CurrentUser,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    return this.tasksService.create(user.id, createTaskDto);
  }

  @Get()
  findAll(@GetCurrentUser() user: CurrentUser): Promise<Task[]> {
    return this.tasksService.findAll(user.id);
  }

  @Get(':id')
  findOne(
    @GetCurrentUser() user: CurrentUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Task> {
    return this.tasksService.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @GetCurrentUser() user: CurrentUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(user.id, id, updateTaskDto);
  }

  @Delete(':id')
  remove(
    @GetCurrentUser() user: CurrentUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.tasksService.remove(user.id, id);
  }
}
