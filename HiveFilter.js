import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const HiveFilter = ({onApplyFilters, onClose}) => {
  const [filters, setFilters] = useState({
    box: '',
    breed: '',
    color: '',
    states: [],
    strength: '',
    queen: '',
    honey: '',
  });

  const [openPicker, setOpenPicker] = useState(null); // Відстежуємо, який picker відкритий

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

  const handleApply = () => {
    const appliedFilters = {
      box: filters.box ? parseInt(filters.box, 10) : null,
      breed: filters.breed || null,
      color: filters.color || null,
      states: filters.states.length > 0 ? filters.states : null,
      strength: filters.strength ? parseInt(filters.strength, 10) : null,
      queen: filters.queen === '' ? null : filters.queen,
      honey: filters.honey ? parseInt(filters.honey, 10) : null,
    };
    console.log('Applying filters:', JSON.stringify(appliedFilters, null, 2));
    onApplyFilters(appliedFilters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      box: '',
      breed: '',
      color: '',
      states: [],
      strength: '',
      queen: '',
      honey: '',
    });
    setOpenPicker(null); // Закриваємо всі pickers
    onApplyFilters({
      box: null,
      breed: null,
      color: null,
      states: null,
      strength: null,
      queen: null,
      honey: null,
    });
    onClose();
  };

  const toggleState = state => {
    setFilters(prev => ({
      ...prev,
      states: prev.states.includes(state)
        ? prev.states.filter(s => s !== state)
        : [...prev.states, state],
    }));
  };

  // Функція для керування відкриттям/закриттям picker
  const handlePickerOpen = picker => {
    setOpenPicker(prev => (prev === picker ? null : picker));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Фільтри</Text>
      <TextInput
        placeholder="Кількість корпусів"
        value={filters.box}
        onChangeText={text => setFilters({...filters, box: text})}
        keyboardType="numeric"
        style={styles.input}
      />
      <DropDownPicker
        open={openPicker === 'breed'}
        value={filters.breed || ''}
        items={breedItems}
        setOpen={() => handlePickerOpen('breed')}
        setValue={callback => setFilters({...filters, breed: callback()})}
        style={[styles.picker, openPicker === 'breed' && styles.activePicker]}
        dropDownContainerStyle={styles.dropDown}
        placeholder="Виберіть породу"
        zIndex={openPicker === 'breed' ? 3000 : 1000}
      />
      <TextInput
        placeholder="Сила"
        value={filters.strength}
        onChangeText={text => setFilters({...filters, strength: text})}
        keyboardType="numeric"
        style={styles.input}
      />
      <DropDownPicker
        open={openPicker === 'color'}
        value={filters.color || ''}
        items={colorItems}
        setOpen={() => handlePickerOpen('color')}
        setValue={callback => setFilters({...filters, color: callback()})}
        style={[styles.picker, openPicker === 'color' && styles.activePicker]}
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
              color={filters.states.includes(state) ? 'blue' : 'gray'}
              onPress={() => toggleState(state)}
            />
          ),
        )}
      </View>
      <DropDownPicker
        open={openPicker === 'queen'}
        value={filters.queen}
        items={queenItems}
        setOpen={() => handlePickerOpen('queen')}
        setValue={callback => setFilters({...filters, queen: callback()})}
        style={[styles.picker, openPicker === 'queen' && styles.activePicker]}
        dropDownContainerStyle={styles.dropDown}
        placeholder="Виберіть"
        zIndex={openPicker === 'queen' ? 1000 : 1000}
      />
      <TextInput
        placeholder="Мед"
        value={filters.honey}
        onChangeText={text => setFilters({...filters, honey: text})}
        keyboardType="numeric"
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <Button title="Застосувати фільтри" onPress={handleApply} />
        <Button title="Скинути усі фільтри" onPress={handleReset} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 5,
    padding: 5,
    zIndex: 0, // Явно задаємо низький zIndex для TextInput
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 5,
  },
  activePicker: {
    zIndex: 5000, // Високий zIndex для активного picker
  },
  dropDown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    zIndex: 5000, // Високий zIndex для випадаючого списку
  },
  statesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 5,
    zIndex: 0, // Низький zIndex для кнопок
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    zIndex: 0, // Низький zIndex для кнопок
  },
});

export default HiveFilter;
