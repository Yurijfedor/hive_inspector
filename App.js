import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  Platform,
  Button,
  Modal,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {request, PERMISSIONS} from 'react-native-permissions';
import Tts from 'react-native-tts';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {VoiceHandler} from './VoiceHandler';
import {getApp, utils} from '@react-native-firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getDatabase,
  ref,
  set,
  update,
  onValue,
} from '@react-native-firebase/database';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  signOut,
} from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import NetInfo from '@react-native-community/netinfo';
import HiveList from './HiveList';
import HiveDetails from './HiveDetails';
// import HiveFilter from './HiveFilter';
import ManualDataModal from './ManualDataModal';
import AuthScreen from './AuthScreen';

// Константи та мапи
const NUMBER_MAP = {
  zero: '0',
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  ten: '10',
  'one two': '12',
};

const UKRAINIAN_NUMBER_MAP = {
  0: 'нуль',
  1: 'один',
  2: 'два',
  3: 'три',
  4: 'чотири',
  5: "п'ять",
  6: 'шість',
  7: 'сім',
  8: 'вісім',
  9: "дев'ять",
  10: 'десять',
};

const BREAD_MAP = {
  1: 'карніка',
  2: 'бакфаст',
  3: 'українська степова',
  4: 'карпатська',
};

const firebaseConfig = {};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// QRScannerModal компонент
const QRScannerModal = ({visible, onClose, onRead}) => {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{flex: 1}}>
        <Text style={{fontSize: 18, padding: 20}}>
          Скануйте QR-код для визначення номера вулика
        </Text>
        {visible && (
          <QRCodeScanner
            onRead={onRead}
            reactivate={false}
            showMarker={true}
            containerStyle={{height: '80%'}}
          />
        )}
        <Button title="Скасувати" onPress={onClose} />
      </View>
    </Modal>
  );
};

// Головний екран із кнопками
const MainScreen = ({navigation}) => {
  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigation.replace('Auth'); // Перенаправлення на екран авторизації
    } catch (error) {
      Alert.alert('Помилка', `Не вдалося вийти: ${error.message}`);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}>
      <Text style={{fontSize: 24, marginBottom: 20}}>BeeVoiceApp</Text>
      <View style={{marginBottom: 20, width: '100%'}}>
        <Button
          title="Введення даних"
          onPress={() => navigation.navigate('Input')}
          color="blue"
        />
      </View>
      <View style={{marginBottom: 20, width: '100%'}}>
        <Button
          title="Перегляд даних"
          onPress={() => navigation.navigate('View')}
          color="blue"
        />
      </View>
      <View style={{width: '100%'}}>
        <Button title="Вийти" onPress={handleSignOut} color="red" />
      </View>
    </View>
  );
};

// Екран введення даних
const InputScreen = () => {
  const [status, setStatus] = useState('Idle');
  const [hiveData, setHiveData] = useState({states: []});
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isManualInputOpen, setIsManualInputOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const voiceHandlerRef = useRef(new VoiceHandler());
  const app = getApp();
  const db = getDatabase(app);

  // Функція для очищення введених даних
  const clearHiveData = async () => {
    setHiveData({states: []});
    setStatus('Дані очищено');
    await speakAsync('Дані очищено');
  };

  const speakAsync = (text, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      let isResolved = false;

      const onFinish = () => {
        if (!isResolved) {
          isResolved = true;
          resolve();
        }
      };

      const onError = event => {
        if (!isResolved) {
          isResolved = true;
          reject(new Error(`TTS error: ${event.error || 'Unknown error'}`));
        }
      };

      Tts.addEventListener('tts-finish', onFinish);
      Tts.addEventListener('tts-error', onError);
      Tts.speak(text);

      setTimeout(() => {
        if (!isResolved) {
          isResolved = true;
          resolve();
        }
      }, timeout);
    });
  };

  const requestMicPermission = async () => {
    try {
      const result = await request(
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.RECORD_AUDIO
          : PERMISSIONS.IOS.MICROPHONE,
      );
      return result === 'granted';
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  };

  const requestCameraPermission = async () => {
    try {
      const result = await request(
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.CAMERA
          : PERMISSIONS.IOS.CAMERA,
      );
      return result === 'granted';
    } catch (error) {
      console.error('Camera permission error:', error);
      return false;
    }
  };

  const speakHiveId = async hiveId => {
    const digits = hiveId.split('');
    const spokenDigits = digits
      .map(digit => UKRAINIAN_NUMBER_MAP[digit] || digit)
      .join(' ');
    await speakAsync(`Номер вулика ${spokenDigits}`);
  };

  const handleQRCodeRead = async ({data}) => {
    setIsQRScannerOpen(false);
    const qrHiveId = data.trim();
    if (/^\d+$/.test(qrHiveId)) {
      const updatedData = {
        ...hiveData,
        hiveId: qrHiveId,
        states: hiveData.states || [],
      };
      console.log('Updated hiveData:', updatedData); // Дебаг
      setHiveData(updatedData);
      setStatus(`Номер вулика: ${qrHiveId}`);
      await speakHiveId(qrHiveId);
    } else {
      setStatus('Невалідний QR-код');
      await speakAsync('Невалідний QR-код');
    }
  };

  const handleManualSave = async manualData => {
    const updatedData = {
      ...hiveData,
      ...manualData,
      states: manualData.states || hiveData.states || [],
    };
    setHiveData(updatedData);
    setStatus(`Дані введено вручну: ${JSON.stringify(updatedData)}`);
    await speakAsync('Дані введено вручну');

    if (updatedData.hiveId) {
      try {
        const netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected) {
          throw new Error('No internet connection');
        }

        const updateData = {};
        if (manualData.box !== null) updateData.box = manualData.box;
        if (manualData.breed !== null) updateData.breed = manualData.breed;
        if (manualData.color !== null) updateData.color = manualData.color;
        if (manualData.states?.length > 0)
          updateData.states = manualData.states;
        if (manualData.strength !== null)
          updateData.strength = manualData.strength;
        if (manualData.queen !== null) updateData.queen = manualData.queen;
        if (manualData.honey !== null) updateData.honey = manualData.honey;

        await update(ref(db, `/hives/${updatedData.hiveId}`), updateData);
        setStatus(`Дані збережено: ${JSON.stringify(updateData)}`);
        await speakAsync('Дані збережено');
        setHiveData({states: []});
      } catch (error) {
        const existingData = await AsyncStorage.getItem(
          `hive_${updatedData.hiveId}`,
        );
        let mergedData = existingData ? JSON.parse(existingData) : {};
        mergedData = {
          ...mergedData,
          hiveId: updatedData.hiveId,
          ...(manualData.box !== null && {box: manualData.box}),
          ...(manualData.breed !== null && {breed: manualData.breed}),
          ...(manualData.color !== null && {color: manualData.color}),
          ...(manualData.states?.length > 0 && {states: manualData.states}),
          ...(manualData.strength !== null && {strength: manualData.strength}),
          ...(manualData.queen !== null && {queen: manualData.queen}),
          ...(manualData.honey !== null && {honey: manualData.honey}),
        };
        await AsyncStorage.setItem(
          `hive_${updatedData.hiveId}`,
          JSON.stringify(mergedData),
        );
        setStatus(`Дані збережено локально: ${JSON.stringify(mergedData)}`);
        await speakAsync('Дані збережено локально');
        setHiveData({states: []});
      }
    } else {
      setStatus('Немає номера вулика для збереження');
      await speakAsync('Немає номера вулика для збереження');
    }
  };

  const syncWithFirebase = async () => {
    try {
      setStatus('Синхронізація даних із Firebase...');
      await speakAsync('Синхронізація даних із Firebase');
      const keys = await AsyncStorage.getAllKeys();
      const hiveKeys = keys.filter(key => key.startsWith('hive_'));
      for (const key of hiveKeys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          const parsedData = JSON.parse(data);
          const hiveId = key.replace('hive_', '');
          const updateData = {};
          if (parsedData.box !== null) updateData.box = parsedData.box;
          if (parsedData.breed !== null) updateData.breed = parsedData.breed;
          if (parsedData.color !== null) updateData.color = parsedData.color;
          if (parsedData.states !== null && parsedData.states.length > 0)
            updateData.states = parsedData.states;
          if (parsedData.strength !== null)
            updateData.strength = parsedData.strength;
          if (parsedData.queen !== null) updateData.queen = parsedData.queen;
          if (parsedData.honey !== null) updateData.honey = parsedData.honey;
          await update(ref(db, `/hives/${hiveId}`), updateData);
          await AsyncStorage.removeItem(key);
        }
      }
      setStatus('Синхронізація завершена успішно');
      await speakAsync('Синхронізація завершена успішно');
      setHiveData({states: []});
    } catch (error) {
      const errorMessage = error.message.includes('timed out')
        ? 'Помилка синхронізації: таймаут підключення до Firebase'
        : error.message.includes('Failed to connect')
        ? 'Помилка синхронізації: не вдалося підключитися до Firebase'
        : `Помилка синхронізації: ${error.message}`;
      setStatus(errorMessage);
      await speakAsync(errorMessage);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        signInAnonymously(auth)
          .then(({user}) => {
            setIsAuthenticated(true);
          })
          .catch(error => {
            setStatus(`Помилка автентифікації: ${error.message}`);
            setIsAuthenticated(false);
          });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const voiceHandler = voiceHandlerRef.current;
    Tts.setDefaultLanguage('uk-UA');
    Tts.setDefaultRate(0.5);
    Tts.setDefaultPitch(1.0);

    const initialize = async () => {
      const hasMicPermission = await requestMicPermission();
      if (!hasMicPermission) {
        setStatus('Мікрофон не дозволено');
        await speakAsync('Мікрофон не дозволено');
        return;
      }

      try {
        await voiceHandler.init(
          async () => {
            setStatus('Ключове слово розпізнано, слухаю команди...');
            await speakAsync('Слухаю команди');
          },
          async inference => {
            if (!inference._isUnderstood || !inference.intent) {
              setStatus('Команда не зрозуміла');
              await speakAsync('Команда не зрозуміла');
              await voiceHandler.resetToPorcupine();
              return;
            }

            let updatedData = {...hiveData, states: hiveData.states || []};

            if (inference.intent === 'id') {
              const digit =
                NUMBER_MAP[inference.slots.id] || inference.slots.id;
              if (inference.slots.final) {
                updatedData.hiveId = inference.slots.hiveId;
                setStatus(`Номер вулика: ${updatedData.hiveId}`);
                await speakHiveId(updatedData.hiveId);
                setHiveData(updatedData);
                await voiceHandler.resetToPorcupine();
              } else {
                setStatus(
                  `Додано цифру: ${
                    UKRAINIAN_NUMBER_MAP[digit] || inference.slots.id
                  }`,
                );
                await speakAsync(
                  `Цифра ${UKRAINIAN_NUMBER_MAP[digit] || inference.slots.id}`,
                );
              }
            } else if (inference.intent === 'box') {
              updatedData.box = parseInt(
                NUMBER_MAP[inference.slots.box] || inference.slots.box,
                10,
              );
              setStatus(
                `Корпусів: ${
                  UKRAINIAN_NUMBER_MAP[updatedData.box] || updatedData.box
                }`,
              );
              await speakAsync(
                `Корпусів ${
                  UKRAINIAN_NUMBER_MAP[updatedData.box] || updatedData.box
                }`,
              );
              setHiveData(updatedData);
              await voiceHandler.resetToPorcupine();
            } else if (inference.intent === 'bread') {
              const breadValue = parseInt(
                NUMBER_MAP[inference.slots.bread] || inference.slots.bread,
                10,
              );
              updatedData.breed = BREAD_MAP[breadValue] || 'невідома порода';
              setStatus(`Порода: ${updatedData.breed}`);
              await speakAsync(`Порода ${updatedData.breed}`);
              setHiveData(updatedData);
              await voiceHandler.resetToPorcupine();
            } else if (inference.intent === 'color') {
              updatedData.color = inference.slots.color;
              setStatus(`Колір: ${inference.slots.color}`);
              await speakAsync(`Колір ${inference.slots.color}`);
              setHiveData(updatedData);
              await voiceHandler.resetToPorcupine();
            } else if (inference.intent === 'state') {
              const newState = inference.slots.state;
              if (!updatedData.states.includes(newState)) {
                updatedData.states = [...updatedData.states, newState];
              }
              setStatus(
                `Стан: ${newState} (додано до ${updatedData.states.join(
                  ', ',
                )})`,
              );
              await speakAsync(`Стан ${newState}`);
              setHiveData(updatedData);
              await voiceHandler.resetToPorcupine();
            } else if (inference.intent === 'strength') {
              updatedData.strength = parseInt(
                NUMBER_MAP[inference.slots.strength] ||
                  inference.slots.strength,
                10,
              );
              setStatus(
                `Сила: ${
                  UKRAINIAN_NUMBER_MAP[updatedData.strength] ||
                  updatedData.strength
                }`,
              );
              await speakAsync(
                `Сила ${
                  UKRAINIAN_NUMBER_MAP[updatedData.strength] ||
                  updatedData.strength
                }`,
              );
              setHiveData(updatedData);
              await voiceHandler.resetToPorcupine();
            } else if (inference.intent === 'queen') {
              updatedData.queen = inference.slots.QueenStatus === 'plus';
              console.log('Queen status:', updatedData.queen); // Дебаг

              setStatus(
                `Королева: ${updatedData.queen ? 'наявна' : 'відсутня'}`,
              );
              await speakAsync(
                `Королева ${updatedData.queen ? 'наявна' : 'відсутня'}`,
              );
              setHiveData(updatedData);
              await voiceHandler.resetToPorcupine();
            } else if (inference.intent === 'honey') {
              updatedData.honey = parseInt(
                NUMBER_MAP[inference.slots.honey] || inference.slots.honey,
                10,
              );
              setStatus(
                `Мед: ${
                  UKRAINIAN_NUMBER_MAP[updatedData.honey] || updatedData.honey
                }`,
              );
              await speakAsync(
                `Мед ${
                  UKRAINIAN_NUMBER_MAP[updatedData.honey] || updatedData.honey
                }`,
              );
              setHiveData(updatedData);
              await voiceHandler.resetToPorcupine();
            } else if (inference.intent === 'stop') {
              if (updatedData.hiveId) {
                const cleanData = {
                  hiveId: updatedData.hiveId,
                  box: updatedData.box !== undefined ? updatedData.box : null,
                  breed:
                    updatedData.breed !== undefined ? updatedData.breed : null,
                  color:
                    updatedData.color !== undefined ? updatedData.color : null,
                  states:
                    updatedData.states.length > 0 ? updatedData.states : null,
                  strength:
                    updatedData.strength !== undefined
                      ? updatedData.strength
                      : null,
                  queen:
                    updatedData.queen !== undefined ? updatedData.queen : null,
                  honey:
                    updatedData.honey !== undefined ? updatedData.honey : null,
                };
                try {
                  const netInfo = await NetInfo.fetch();
                  if (!netInfo.isConnected) {
                    throw new Error('No internet connection');
                  }
                  console.log(cleanData.queen);

                  const updateData = {};
                  if (cleanData.box !== null) updateData.box = cleanData.box;
                  if (cleanData.breed !== null)
                    updateData.breed = cleanData.breed;
                  if (cleanData.color !== null)
                    updateData.color = cleanData.color;
                  if (cleanData.states !== null)
                    updateData.states = cleanData.states;
                  if (cleanData.strength !== null)
                    updateData.strength = cleanData.strength;
                  if (cleanData.queen !== null)
                    updateData.queen = cleanData.queen;
                  if (cleanData.honey !== null)
                    updateData.honey = cleanData.honey;

                  await update(
                    ref(db, `/hives/${updatedData.hiveId}`),
                    updateData,
                  );
                  setStatus(`Дані збережено: ${JSON.stringify(updateData)}`);
                  await speakAsync('Дані збережено');
                  setHiveData({states: []});
                } catch (error) {
                  const existingData = await AsyncStorage.getItem(
                    `hive_${updatedData.hiveId}`,
                  );
                  let mergedData = existingData ? JSON.parse(existingData) : {};
                  mergedData = {
                    ...mergedData,
                    hiveId: updatedData.hiveId,
                    ...(updatedData.box !== undefined && {
                      box: updatedData.box,
                    }),
                    ...(updatedData.breed !== undefined && {
                      breed: updatedData.breed,
                    }),
                    ...(updatedData.color !== undefined && {
                      color: updatedData.color,
                    }),
                    ...(updatedData.states.length > 0 && {
                      states: updatedData.states,
                    }),
                    ...(updatedData.strength !== undefined && {
                      strength: updatedData.strength,
                    }),
                    ...(updatedData.queen !== undefined && {
                      queen: updatedData.queen,
                    }),
                    ...(updatedData.honey !== undefined && {
                      honey: updatedData.honey,
                    }),
                  };
                  await AsyncStorage.setItem(
                    `hive_${updatedData.hiveId}`,
                    JSON.stringify(mergedData),
                  );
                  setStatus(
                    `Дані збережено локально: ${JSON.stringify(mergedData)}`,
                  );
                  await speakAsync('Дані збережено локально');
                  setHiveData({states: []});
                }
              } else {
                setStatus('Немає номера вулика для збереження');
                await speakAsync('Немає номера вулика для збереження');
              }
              setStatus('Очікую ключове слово...');
              await speakAsync('Очікую ключове слово');
              await voiceHandler.resetToPorcupine();
            }
          },
        );
        await voiceHandler.start();
        setStatus('Очікую ключове слово...');
        await speakAsync('Очікую ключове слово');
      } catch (error) {
        setStatus(`Помилка: ${error.message}`);
        await speakAsync(`Помилка: ${error.message}`);
      }
    };

    initialize();

    return () => {
      voiceHandler.stop();
      Tts.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hiveData]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
      }}>
      <Text style={{fontSize: 16, marginBottom: 10}}>Статус: {status}</Text>
      <Text style={{fontSize: 16, marginBottom: 20}}>
        Дані: {JSON.stringify(hiveData)}
      </Text>
      <View style={{marginBottom: 10, width: '100%'}}>
        <Button
          title="Сканувати QR-код"
          onPress={async () => {
            const hasCameraPermission = await requestCameraPermission();
            if (hasCameraPermission) {
              setIsQRScannerOpen(true);
            } else {
              setStatus('Камера не дозволена');
              await speakAsync('Камера не дозволена');
            }
          }}
        />
      </View>
      <View style={{marginBottom: 10, width: '100%'}}>
        <Button
          title="Ввести дані вручну"
          onPress={() => setIsManualInputOpen(true)}
        />
      </View>
      <View style={{marginBottom: 10, width: '100%'}}>
        <Button title="Очистити дані" onPress={clearHiveData} color="red" />
      </View>
      <View style={{marginBottom: 10, width: '100%'}}>
        <Button title="Синхронізувати з Firebase" onPress={syncWithFirebase} />
      </View>

      <QRScannerModal
        visible={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onRead={handleQRCodeRead}
      />
      <ManualDataModal
        visible={isManualInputOpen}
        onClose={() => setIsManualInputOpen(false)}
        onSave={handleManualSave}
        initialHiveId={hiveData.hiveId || ''}
      />
    </View>
  );
};

// Екран перегляду даних
const ViewScreen = () => {
  const [selectedHive, setSelectedHive] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState(null);

  return (
    <View style={{flex: 1, padding: 10}}>
      {/* <HiveFilter onApplyFilters={setAppliedFilters} /> */}
      <HiveList onSelectHive={setSelectedHive} filters={appliedFilters} />
      <HiveDetails
        visible={!!selectedHive}
        hive={selectedHive}
        onClose={() => setSelectedHive(null)}
      />
    </View>
  );
};

// Налаштування навігації
const Stack = createStackNavigator();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, user => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? 'Main' : 'Auth'}>
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{title: 'Авторизація', headerShown: false}}
        />
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{title: 'BeeVoiceApp'}}
        />
        <Stack.Screen
          name="Input"
          component={InputScreen}
          options={{title: 'Введення даних'}}
        />
        <Stack.Screen
          name="View"
          component={ViewScreen}
          options={{title: 'Перегляд даних'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
