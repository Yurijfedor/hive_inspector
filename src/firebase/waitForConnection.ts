import database from '@react-native-firebase/database';

export function waitForConnection(): Promise<void> {
  return new Promise((resolve) => {
    const ref = database().ref('.info/connected');

    const handler = (snap: any) => {
      const isConnected = snap.val();
      console.log('🌐 CONNECTED:', isConnected);

      if (isConnected === true) {
        ref.off('value', handler);
        resolve();
      }
    };

    ref.on('value', handler);
  });
}
