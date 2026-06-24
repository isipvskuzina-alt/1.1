1. /* Пример использования текстовых стилей */
.text-styles {
  font-family: 'Arial', 'Helvetica', sans-serif; /* Шрифт */
  font-size: 16px; /* Размер шрифта */
  line-height: 1.6; /* Межстрочный интервал (1.6 = 160% от размера шрифта) */
  letter-spacing: 0.5px; /* Межбуквенный интервал */
  text-align: left; /* Выравнивание текста: left, right, center, justify */
}

/* Дополнительные примеры */
h1 {
  font-family: 'Georgia', serif;
  font-size: 32px;
  line-height: 1.2;
  letter-spacing: 1px;
  text-align: center;
}

p {
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  line-height: 1.8;
  letter-spacing: 0.3px;
  text-align: justify; /* Выравнивание по ширине */
}

2. Зачем нужен key при выводе списка компонентов?
Key в React (или аналогичных фреймворках) нужен для:

Идентификации элементов в списке

Оптимизации рендеринга - помогает React определять, какие элементы изменились, добавились или удалились

Сохранения состояния компонентов при обновлении списка

// ПРАВИЛЬНО - с уникальным key
{tasks.map(task => (
  <TaskItem key={task.id} task={task} />
))}

// НЕПРАВИЛЬНО - использование index как key (может вызвать проблемы)
{tasks.map((task, index) => (
  <TaskItem key={index} task={task} />
))}

Лучшие практики:

Используйте уникальный ID из данных

Не используйте index массива (может привести к багам при сортировке/удалении)

Key должен быть стабильным и предсказуемым