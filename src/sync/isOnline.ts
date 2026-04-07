import NetInfo from '@react-native-community/netinfo';

export async function isOnline(): Promise<boolean> {
  const state = await NetInfo.fetch();

  console.log('🌐 NETINFO:', state);

  // 🔥 ключовий момент
  if (state.isConnected === false) return false;

  // якщо undefined/null — не блокуємо
  if (state.isInternetReachable === false) return false;

  return true;
}
