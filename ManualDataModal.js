import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const ManualDataModal = ({
  visible,
  onClose,
  onSave,
  initialHiveId = '',
  initialData = {},
}) => {
  console.log(
    'ManualDataModal received initialHiveId:',
    initialHiveId,
    'initialData:',
    initialData,
  );
  const [manualData, setManualData] = useState({
    hiveId: initialHiveId,
    box: initialData.box?.toString() || '',
    breed: initialData.breed || '',
    color: initialData.color || '',
    states: initialData.states || [],
    strength: initialData.strength?.toString() || '',
    queen: initialData.queen === null ? '' : initialData.queen,
    honey: initialData.honey?.toString() || '',
  });

  const [openPicker, setOpenPicker] = useState(null);

  useEffect(() => {
    setManualData({
      hiveId: initialHiveId,
      box: initialData.box?.toString() || '',
      breed: initialData.breed || '',
      color: initialData.color || '',
      states: initialData.states || [],
      strength: initialData.strength?.toString() || '',
      queen: initialData.queen === null ? '' : initialData.queen,
      honey: initialData.honey?.toString() || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialHiveId]);

  const breedItems = [
    {label: 'Усі породи', value: ''},
    {label: 'Карніка', value: 'карніка'},
    {label: 'Бакфаст', value: 'бакфаст'},
    {label: 'Українська степова', value: 'українська степова'},
    {label: 'Карпатська', value: 'карпатська'},
    {label: 'Невідома порода', value: 'невідома порода'},
  ];

  const colorItems = [
    {label: 'Усі кольори', value: ''},
    {label: 'Червоний', value: 'red'},
    {label: 'Зелений', value: 'green'},
    {label: 'Жовтий', value: 'yellow'},
    {label: 'Білий', value: 'white'},
    {label: 'Синій', value: 'blue'},
  ];

  const queenItems = [
    {label: 'Наявність матки (не важливо)', value: ''},
    {label: 'Наявна', value: true},
    {label: 'Відсутня', value: false},
  ];

  const handlePickerOpen = picker => {
    setOpenPicker(prev => (prev === picker ? null : picker));
  };

  const toggleState = state => {
    setManualData(prev => ({
      ...prev,
      states: prev.states.includes(state)
        ? prev.states.filter(s => s !== state)
        : [...prev.states, state],
    }));
  };

  const handleSave = () => {
    const formattedData = {
      hiveId: manualData.hiveId || null,
      box: manualData.box ? parseInt(manualData.box, 10) : null,
      breed: manualData.breed || null,
      color: manualData.color || null,
      states: manualData.states.length > 0 ? manualData.states : null,
      strength: manualData.strength ? parseInt(manualData.strength, 10) : null,
      queen: manualData.queen === '' ? null : manualData.queen,
      honey: manualData.honey ? parseInt(manualData.honey, 10) : null,
    };
    console.log('Saving data:', JSON.stringify(formattedData, null, 2));
    onSave(formattedData);
    setManualData({
      hiveId: '',
      box: '',
      breed: '',
      color: '',
      states: [],
      strength: '',
      queen: '',
      honey: '',
    });
    setOpenPicker(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.title}>
            {initialHiveId ? 'Редагувати вулик' : 'Введення даних вручну'}
          </Text>

          <TextInput
            placeholder="Номер вулика"
            value={manualData.hiveId}
            onChangeText={text => setManualData({...manualData, hiveId: text})}
            style={styles.input}
            editable={initialHiveId === ''} // Забороняємо редагувати hiveId при редагуванні
          />

          <TextInput
            placeholder="Кількість корпусів"
            value={manualData.box}
            onChangeText={text => setManualData({...manualData, box: text})}
            keyboardType="numeric"
            style={styles.input}
          />

          <DropDownPicker
            open={openPicker === 'breed'}
            value={manualData.breed || ''}
            items={breedItems}
            setOpen={() => handlePickerOpen('breed')}
            setValue={callback =>
              setManualData({...manualData, breed: callback()})
            }
            style={[
              styles.picker,
              openPicker === 'breed' && styles.activePicker,
            ]}
            dropDownContainerStyle={styles.dropDown}
            placeholder="Виберіть породу"
            zIndex={openPicker === 'breed' ? 3000 : 1000}
          />

          <DropDownPicker
            open={openPicker === 'color'}
            value={manualData.color || ''}
            items={colorItems}
            setOpen={() => handlePickerOpen('color')}
            setValue={callback =>
              setManualData({...manualData, color: callback()})
            }
            style={[
              styles.picker,
              openPicker === 'color' && styles.activePicker,
            ]}
            dropDownContainerStyle={styles.dropDown}
            placeholder="Виберіть колір"
            zIndex={openPicker === 'color' ? 2000 : 1000}
          />

          <View style={styles.statesContainer}>
            {['queen in cage', 'virgin', 'swarm', 'split', 'sick', 'drone'].map(
              state => (
                <Button
                  key={state}
                  title={state}
                  color={manualData.states.includes(state) ? 'blue' : 'gray'}
                  onPress={() => toggleState(state)}
                />
              ),
            )}
          </View>

          <TextInput
            placeholder="Сила"
            value={manualData.strength}
            onChangeText={text =>
              setManualData({...manualData, strength: text})
            }
            keyboardType="numeric"
            style={styles.input}
          />

          <DropDownPicker
            open={openPicker === 'queen'}
            value={manualData.queen}
            items={queenItems}
            setOpen={() => handlePickerOpen('queen')}
            setValue={callback =>
              setManualData({...manualData, queen: callback()})
            }
            style={[
              styles.picker,
              openPicker === 'queen' && styles.activePicker,
            ]}
            dropDownContainerStyle={styles.dropDown}
            placeholder="Виберіть"
            zIndex={openPicker === 'queen' ? 1000 : 1000}
          />

          <TextInput
            placeholder="Мед"
            value={manualData.honey}
            onChangeText={text => setManualData({...manualData, honey: text})}
            keyboardType="numeric"
            style={styles.input}
          />

          <View style={styles.buttonContainer}>
            <Button title="Зберегти" onPress={handleSave} />
            <Button title="Скасувати" onPress={onClose} color="red" />
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 5,
    padding: 10,
    zIndex: 0,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 5,
  },
  activePicker: {
    zIndex: 5000,
  },
  dropDown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    zIndex: 5000,
  },
  statesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 5,
    zIndex: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    zIndex: 0,
  },
});

export default ManualDataModal;
