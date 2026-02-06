import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  getAuth,
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Налаштування Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '985102730017-hp7jif3129ct7cem77uonp17tp2p1keb.apps.googleusercontent.com ',
      offlineAccess: true,
    });
  }, []);
  // Авторизація через email/пароль
  const handleEmailSignIn = async () => {
    if (email === '' || password === '') {
      Alert.alert('Помилка', 'Будь ласка, введіть email та пароль.');
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        getAuth(),
        email,
        password,
      );
      const user = userCredential.user;
      await AsyncStorage.setItem(
        'user',
        JSON.stringify({uid: user.uid, email: user.email}),
      );
      console.log('Signed in user:', user.uid, user.email);
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Помилка', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Реєстрація через email/пароль
  const handleSignUp = async () => {
    if (email === '' || password === '') {
      Alert.alert('Помилка', 'Будь ласка, введіть email та пароль.');
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        getAuth(),
        email,
        password,
      );
      const user = userCredential.user;
      await AsyncStorage.setItem(
        'user',
        JSON.stringify({uid: user.uid, email: user.email}),
      );
      console.log('Registered user:', user.uid, user.email);
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Помилка', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Авторизація через Google
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      console.log('Checking Google Play Services...');
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      console.log('Google Play Services available, signing in...');
      const {idToken, user} = await GoogleSignin.signIn();
      console.log(
        'Google Sign-In successful, idToken:',
        idToken,
        'User:',
        user,
      );
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      console.log('Firebase credential created, signing in to Firebase...');
      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );
      console.log('Firebase sign-in successful, user:', userCredential.user);
      navigation.replace('Main');
    } catch (error) {
      console.error(
        'Google Sign-In Error:',
        error,
        'Code:',
        error.code,
        'Message:',
        error.message,
      );
      Alert.alert(
        'Помилка',
        `Google Sign-In Error: ${error.message} (Code: ${error.code})`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вхід до BeeVoiceApp</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Увійти"
          onPress={handleEmailSignIn}
          disabled={isLoading}
        />
        <Button
          title="Реєстрація"
          onPress={handleSignUp}
          disabled={isLoading}
        />
        <Button
          title="Увійти через Google"
          onPress={handleGoogleSignIn}
          disabled={isLoading}
          color="#4285F4"
        />
      </View>
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
    gap: 10,
  },
});

export default AuthScreen;
