export default {
  title: 'Вулик {{hiveNumber}}',

  loading: 'Завантаження...',

  sections: {
    status: 'Стан',
    signs: 'Ознаки',
    lastInspection: 'Останній огляд',
  },

  actions: {
    tasks: 'Завдання',
    manualInspection: 'Ручний огляд',
    history: 'Історія',
    delete: 'Видалити вулик',
  },

  delete: {
    title: 'Видалити вулик?',
    message: 'Ви дійсно хочете видалити вулик №{{hiveNumber}}?',
    confirm: 'Видалити',
    error: 'Не вдалося видалити вулик.',
  },

  fields: {
    strength: 'Сила',
    brood: 'Розплід',
    honey: 'Мед',
    queen: 'Матка',
    swarm: 'Роїння',
    disease: 'Хвороби',
  },

  empty: {
    noData: 'Немає даних',
  },
};
