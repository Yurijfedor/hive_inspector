export const getTaskTypeLabel = (type: string) => {
  switch (type) {
    case 'FEEDING':
      return '🍯 Підгодівля';
    case 'INSPECTION':
      return '🐝 Огляд';
    case 'DISEASE':
      return '🧬 Хвороби';
    case 'SWARM':
      return '🐝 Роїння';
    case 'SPLIT':
      return '🪺 Відводки';
    default:
      return '📋 Інше';
  }
};
