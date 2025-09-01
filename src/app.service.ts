import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/todo';
    const dbPassword = process.env.DB_PASSWORD || 'not-set';
    return `Hello from NestJS! DB URL: ${dbUrl}, DB Password: ${dbPassword}`;
  }
}
