export const tasksList = (todos) =>
  `Твой список задач: \n\n${todos
    .map((todo) => (todo.isCompleted ? '✅' : '🔘') + ' ' + todo.name + '\n\n')
    .join('')}`;
