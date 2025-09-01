import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoModule } from './todo/todo.module';
import { PrometheusController } from './prometheus/prometheus.controller';
import { PrometheusInterceptor } from './prometheus/prometheus.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.DB_URL || 'mongodb://localhost:27017/admin',
      {
        user: 'admin',
        pass: process.env.DB_PASSWORD,
        dbName: 'todo', // Use 'todo' database after authentication
      },
    ),
    TodoModule,
  ],
  controllers: [AppController, PrometheusController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: PrometheusInterceptor,
    },
  ],
})
export class AppModule {}
