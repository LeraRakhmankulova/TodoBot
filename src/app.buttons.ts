import { Markup } from 'telegraf';

export function actionButtons() {
  return Markup.keyboard(
    [
      Markup.button.callback('Список задач', 'list'),
      Markup.button.callback('Создать', 'create'),
      Markup.button.callback('Завершить', 'done'),
      Markup.button.callback('Редактировать', 'edit'),
      Markup.button.callback('Удалить', 'delete'),
    ],
    {
      columns: 2,
    },
  );
}
