import React, {useState} from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';

type Props = {
  value: number | null;
  onChange: (hive: number) => void;
  hives: number[];
};

export const HiveSelector = ({value, onChange, hives}: Props) => {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setVisible(true)}>
        <Text>{value ? `🐝 Вулик ${value}` : 'Оберіть вулик'}</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            {hives.map((h) => (
              <TouchableOpacity
                key={h}
                style={styles.item}
                onPress={() => {
                  onChange(h);
                  setVisible(false);
                }}>
                <Text>🐝 Вулик {h}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={{marginTop: 10}}>Закрити</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selector: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    // backgroundColor: '#fff',
  },

  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#00000055',
  },

  modal: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 10,
    padding: 16,
  },

  item: {
    padding: 12,
  },
});
