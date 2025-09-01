import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from './todo.schema';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

  async create(title: string, description?: string): Promise<Todo> {
    const todo = new this.todoModel({ title, description });
    return todo.save();
  }

  async findAll(): Promise<Todo[]> {
    return this.todoModel.find().exec();
  }

  async findById(id: string): Promise<Todo | null> {
    return this.todoModel.findById(id).exec();
  }

  async update(
    id: string,
    title: string,
    description?: string,
  ): Promise<Todo | null> {
    return this.todoModel
      .findByIdAndUpdate(id, { title, description }, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Todo | null> {
    return this.todoModel.findByIdAndDelete(id).exec();
  }
}
