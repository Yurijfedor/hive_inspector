import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../auth/AuthProvider';

export const SideMenu = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const navigation = useNavigation<any>();
  const {role} = useAuth();

  if (!visible) return null;

  const screens = [
    {name: 'Apiary', label: '🐝 Пасіка'},
    {name: 'Today', label: '📅 Сьогодні'},
    {name: 'TasksList', label: '📋 Задачі'},
    ...(role === 'admin' ? [{name: 'Dev', label: '🧪 Dev'}] : []),
  ];

  return (
    <View style={styles.overlay}>
      <View style={styles.menu}>
        {screens.map((s) => (
          <TouchableOpacity
            key={s.name}
            onPress={() => {
              navigation.navigate(s.name);
              onClose();
            }}>
            <Text style={styles.item}>{s.label}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={onClose}>
          <Text style={styles.close}>Закрити</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000088',
    justifyContent: 'flex-start',
  },
  menu: {
    width: 250,
    backgroundColor: '#fff',
    padding: 16,
  },
  item: {
    fontSize: 16,
    marginBottom: 12,
  },
  close: {
    marginTop: 20,
    color: 'red',
  },
});
