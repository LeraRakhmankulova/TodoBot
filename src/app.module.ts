import { Module } from '@nestjs/common';
import { AppUpdate } from './app.update';
import { AppService } from './app.service';
import * as LocalSession from 'telegraf-session-local';
import { TelegrafModule } from 'nestjs-telegraf';
import { TG_TOKEN } from './config';
import {TypeOrmModule} from '@nestjs/typeorm';
import { join } from 'path';
import { TaskEntity } from './task.entity';

const session = new LocalSession({ database: 'session_db.json' });

@Module({
  imports: [
    TelegrafModule.forRoot({
      middlewares: [session.middleware()],
      token: TG_TOKEN,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'todo-app',
      username: 'postgres',
      password: '',
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      migrations: [join(__dirname, '**', '*.migration.{ts,js}')],
      synchronize: true
    }),
    TypeOrmModule.forFeature([TaskEntity])
  ],
  providers: [AppService, AppUpdate],
})
export class AppModule { }
