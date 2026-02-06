import React from 'react';
import {Modal, View, Text, Button} from 'react-native';

const HiveDetails = ({visible, hive, onClose}) => {
  if (!hive) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{flex: 1, padding: 20}}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
          Вулик ID: {hive.hiveId}
        </Text>
        <Text>Корпусів: {hive.box ? hive.box : 'Не вказано'}</Text>
        <Text>Порода: {hive.breed || 'Не вказано'}</Text>
        <Text>Колір: {hive.color || 'Не вказано'}</Text>
        <Text>
          Стани:{' '}
          {hive.states?.length > 0 ? hive.states.join(', ') : 'Не вказано'}
        </Text>
        <Text>Сила: {hive.strength ? hive.strength : 'Не вказано'}</Text>
        <Text>
          Королева:{' '}
          {hive.queen !== null
            ? hive.queen
              ? 'Наявна'
              : 'Відсутня'
            : 'Не вказано'}
        </Text>
        <Text>Мед: {hive.honey ? hive.honey : 'Не вказано'}</Text>
        <Button title="Закрити" onPress={onClose} />
      </View>
    </Modal>
  );
};

export default HiveDetails;
