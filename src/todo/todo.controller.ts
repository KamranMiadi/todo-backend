import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.schema';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  async create(
    @Body('title') title: string,
    @Body('description') description?: string,
  ): Promise<Todo> {
    return this.todoService.create(title, description);
  }

  @Get()
  async findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('description') description?: string,
  ): Promise<Todo | null> {
    return this.todoService.update(id, title, description);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Todo | null> {
    return this.todoService.delete(id);
  }
}
