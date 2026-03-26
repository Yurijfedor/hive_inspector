import React, {useState} from 'react';
import {View, Text, TextInput, Button, ScrollView} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';

import {Task} from '../types/task';
// import {saveTasks} from '../services/tasks/tasksStorage';
import {TaskRepository} from '../domain/repositories/taskRepository';

// type Props = {
//   route: {
//     params: {
//       initialTasks: Task[];
//     };
//   };
//   navigation: any;
// };

export const TasksScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const repo = new TaskRepository();

  const {initialTasks} = route.params;

  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // ✏️ редагування title
  const updateTitle = (index: number, text: string) => {
    const updated = [...tasks];
    updated[index] = {
      ...updated[index],
      title: text,
    };
    setTasks(updated);
  };

  const handleSave = async () => {
    await repo.saveAll(tasks);
    console.log('💾 SAVING TASKS:', tasks);

    navigation.goBack();
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
      }}>
      <Text style={{fontSize: 22, marginBottom: 20}}>🧠 AI задачі</Text>

      {tasks.map((task, index) => (
        <View
          key={task.id}
          style={{
            padding: 12,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 10,
            marginBottom: 15,
          }}>
          <Text>🐝 Вулик: {task.hiveNumber}</Text>

          <Text style={{marginTop: 5}}>📌 Назва:</Text>
          <TextInput
            value={task.title}
            onChangeText={(text) => updateTitle(index, text)}
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              padding: 8,
              marginTop: 5,
              borderRadius: 6,
            }}
          />

          <Text style={{marginTop: 5}}>📂 Тип: {task.type}</Text>

          <Text style={{marginTop: 5}}>
            📅 {new Date(task.date).toLocaleDateString()}
          </Text>
        </View>
      ))}

      <View style={{marginTop: 20}}>
        <Button title="💾 Зберегти" onPress={handleSave} />
      </View>
    </ScrollView>
  );
};
