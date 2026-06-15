import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
  ) {}

  create(userId: number, createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectsRepository.create({
      ...createProjectDto,
      userId,
    });

    return this.projectsRepository.save(project);
  }

  findAll(userId: number): Promise<Project[]> {
    return this.projectsRepository.find({
      where: { userId },
      order: { id: 'ASC' },
    });
  }

  async findOne(userId: number, id: number): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id, userId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(
    userId: number,
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.findOne(userId, id);
    Object.assign(project, updateProjectDto);
    return this.projectsRepository.save(project);
  }

  async remove(userId: number, id: number): Promise<{ message: string }> {
    const project = await this.findOne(userId, id);
    await this.projectsRepository.remove(project);
    return { message: 'Project deleted' };
  }
}
