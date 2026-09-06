import {
  check,
  request,
  RESULTS,
  PERMISSIONS,
  openSettings,
} from 'react-native-permissions';
import {Platform} from 'react-native';

export async function requestMicrophonePermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  const permission = PERMISSIONS.ANDROID.RECORD_AUDIO;

  const status = await check(permission);

  if (status === RESULTS.GRANTED) {
    return true;
  }

  if (status === RESULTS.DENIED) {
    const result = await request(permission);

    return result === RESULTS.GRANTED;
  }

  if (status === RESULTS.BLOCKED) {
    return false;
  }

  return false;
}

export async function openMicrophoneSettings() {
  await openSettings();
}
