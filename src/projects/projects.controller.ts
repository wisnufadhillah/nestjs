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
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './project.entity';
import { ProjectsService } from './projects.service';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(
    @GetCurrentUser() user: CurrentUser,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    return this.projectsService.create(user.id, createProjectDto);
  }

  @Get()
  findAll(@GetCurrentUser() user: CurrentUser): Promise<Project[]> {
    return this.projectsService.findAll(user.id);
  }

  @Get(':id')
  findOne(
    @GetCurrentUser() user: CurrentUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Project> {
    return this.projectsService.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @GetCurrentUser() user: CurrentUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectsService.update(user.id, id, updateProjectDto);
  }

  @Delete(':id')
  remove(
    @GetCurrentUser() user: CurrentUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.projectsService.remove(user.id, id);
  }
}
