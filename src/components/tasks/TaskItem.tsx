import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';

import {useAppTranslation} from '../../hooks/useAppTranslation';

import {Task} from '../../types/task';

type Props = {
  task: Task;
  onToggle: () => void;
  onPress: () => void;
};

export const TaskItem = ({task, onPress}: Props) => {
  const {t} = useAppTranslation();

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.card, task.completed && styles.completedCard]}>
        <Text style={styles.title}>{task.title}</Text>

        <Text style={styles.hive}>
          🐝 {t('tasks:hive')} #{task.hiveNumber}
        </Text>

        <Text style={styles.status}>
          {task.completed
            ? `✅ ${t('tasks:completed')}`
            : `⏳ ${t('tasks:pending')}`}
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

  hive: {
    marginTop: 4,
  },

  status: {
    marginTop: 4,
  },
});
