import React, {useState} from 'react';

import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

import {useAppTranslation} from '../hooks/useAppTranslation';

type Props = {
  value: number | null;

  onChange: (hive: number) => void;

  hives: number[];
};

export const HiveSelector = ({value, onChange, hives}: Props) => {
  const [visible, setVisible] = useState(false);

  const {t} = useAppTranslation();

  return (
    <View>
      {/* SELECTOR */}

      <TouchableOpacity
        style={styles.selector}
        onPress={() => setVisible(true)}>
        <Text>
          {value ? `🐝 ${t('tasks:hive')} #${value}` : t('tasks:selectHive')}
        </Text>
      </TouchableOpacity>

      {/* MODAL */}

      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {hives.map((h) => (
                <TouchableOpacity
                  key={h}
                  style={styles.item}
                  onPress={() => {
                    onChange(h);

                    setVisible(false);
                  }}>
                  <Text>
                    🐝 {t('tasks:hive')} #{h}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={styles.closeText}>{t('tasks:close')}</Text>
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

    maxHeight: '70%',
  },

  item: {
    padding: 12,
  },

  closeText: {
    marginTop: 10,

    textAlign: 'center',

    fontWeight: '600',
  },
});
