import {
  Ctx,
  Hears,
  InjectBot,
  Message,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { actionButtons } from './app.buttons';
import { AppService } from './app.service';
import { tasksList } from './app.utils';
import { Context } from './context.interface';

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
  ) { }

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Hello!!!');
    await ctx.reply('Что ты хочешь сделать?', actionButtons());
  }

  @Hears('Список задач')
  async getTask(ctx: Context) {
    const todos = await this.appService.getAll()
    await ctx.reply(tasksList(todos));
  }

  @Hears('Завершить')
  async doneTask(ctx: Context) {
    ctx.session.type = 'done';
    await ctx.deleteMessage();
    await ctx.reply('Напиши Id задачи: ');
  }
  @Hears('Создать')
  async createTask(ctx: Context) {
    ctx.session.type = 'create';
    await ctx.reply('Опиши задачу: ')
  }
  @Hears('Удалить')
  async deleteTask(ctx: Context) {
    ctx.session.type = 'delete';
    await ctx.deleteMessage();
    await ctx.reply('Напиши Id задачи: ');
  }
  @Hears('Редактировать')
  async editTask(ctx: Context) {
    ctx.session.type = 'edit';
    await ctx.deleteMessage();
    await ctx.replyWithHTML(
      'Напиши Id и новое название задачи: \n\n' +
      '<b>В формате - 1 | Новое название</b>'
    )
  }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: Context) {
    if (!ctx.session.type) return

    if (ctx.session.type === 'done') {
      const todos = await this.appService.doneTask(Number(message))

      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply('Такого нет 👀, смотри внимательно')
        return;
      }
      await ctx.reply(tasksList(todos));
    }

    if (ctx.session.type === 'delete') {
      const todos = this.appService.deleteTask(Number(message))

      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply('Такого нет 👀, смотри внимательно')
        return;
      }
      await ctx.reply(tasksList(todos));
    }

    if (ctx.session.type === 'edit') {
      const [taskId, taskName] = message.split(' | ');
      const todos = await this.appService.editTask(Number(taskId), taskName)
      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply('Такого нет 👀, смотри внимательно')
        return;
      }
      await ctx.reply(tasksList(todos));
    }

    if (ctx.session.type === 'create') {
      const todos = await this.appService.createTask(message);
      await ctx.reply(tasksList(todos))
    }
  }
}
