import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectsService } from '../projects/projects.service';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    private readonly projectsService: ProjectsService,
  ) {}

  async create(userId: number, createTaskDto: CreateTaskDto): Promise<Task> {
    await this.projectsService.findOne(userId, createTaskDto.projectId);

    const task = this.tasksRepository.create({
      ...createTaskDto,
      userId,
      status: createTaskDto.status ?? 'todo',
    });

    return this.tasksRepository.save(task);
  }

  findAll(userId: number): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { userId },
      relations: { project: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(userId: number, id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, userId },
      relations: { project: true },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(
    userId: number,
    id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.findOne(userId, id);

    if (updateTaskDto.projectId) {
      await this.projectsService.findOne(userId, updateTaskDto.projectId);
    }

    Object.assign(task, updateTaskDto);
    return this.tasksRepository.save(task);
  }

  async remove(userId: number, id: number): Promise<{ message: string }> {
    const task = await this.findOne(userId, id);
    await this.tasksRepository.remove(task);
    return { message: 'Task deleted' };
  }
}
