import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';

import {Task} from '../../types/task';
type Props = {
  task: Task;
  onToggle: () => void;
};

export const TaskItem = ({task, onToggle}: Props) => {
  return (
    <TouchableOpacity onPress={onToggle}>
      <View style={[styles.card, task.completed && styles.completedCard]}>
        <Text style={styles.title}>{task.title}</Text>

        <Text>🐝 Вулик {task.hiveNumber}</Text>

        <Text style={styles.status}>
          {task.completed ? '✅ Виконано' : '⏳ Очікує'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },

  completedCard: {
    backgroundColor: '#e6f7e6',
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
  },

  status: {
    marginTop: 4,
  },
});
