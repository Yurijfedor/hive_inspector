import {
  getAuth,
  signOut,
  GoogleAuthProvider,
  signInWithCredential,
  linkWithCredential,
} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const auth = getAuth();

export async function signInWithGoogle() {
  try {
    // 1. Google Sign-In
    await GoogleSignin.hasPlayServices();

    // ❗ НЕ завжди робимо signOut тут!
    // тільки якщо хочемо switch account

    const signInResult = await GoogleSignin.signIn();

    console.log('GOOGLE RESULT:', signInResult);

    // ❗ важлива перевірка
    if (signInResult.type !== 'success') {
      throw new Error('Google sign-in cancelled');
    }

    const idToken = signInResult.data?.idToken;

    if (!idToken) {
      console.log('❌ INVALID GOOGLE RESULT:', signInResult);
      throw new Error('No idToken from Google');
    }

    // 2. Firebase credential
    const googleCredential = GoogleAuthProvider.credential(idToken);

    const currentUser = auth.currentUser;

    // 🔥 3. LINK якщо anonymous
    if (currentUser && currentUser.isAnonymous) {
      try {
        console.log('🔗 Linking anonymous → Google');

        const linkResult = await linkWithCredential(
          currentUser,
          googleCredential,
        );

        console.log('✅ LINKED USER:', linkResult.user.uid);

        return linkResult.user;
      } catch (e: any) {
        console.log('⚠️ LINK FAILED:', e.code);

        // 🔥 КЛЮЧОВИЙ ФІКС
        if (
          e.code === 'auth/email-already-in-use' ||
          e.code === 'auth/credential-already-in-use'
        ) {
          console.log('🔐 Signing in instead of linking');

          const signInAnonymouslyResult = await signInWithCredential(
            auth,
            googleCredential,
          );

          console.log(
            '✅ SIGNED IN EXISTING USER:',
            signInAnonymouslyResult.user.uid,
          );

          return signInResult.user;
        }

        throw e;
      }
    }

    // 4. Звичайний login
    console.log('🔐 Signing in with Google');

    const result = await signInWithCredential(auth, googleCredential);

    console.log('✅ GOOGLE USER:', result.user.uid);

    return result.user;
  } catch (e: any) {
    console.log('❌ Google sign-in error', e);

    // 🔥 ОБРОБКА КЕЙСУ: акаунт вже існує
    if (e.code === 'auth/credential-already-in-use') {
      console.log('⚠️ Credential already in use → signing in');

      const credential = GoogleAuthProvider.credential(e.idToken);
      const result = await signInWithCredential(auth, credential);

      return result.user;
    }

    throw e;
  }
}

export async function logout() {
  try {
    console.log('🚪 Logging out...');

    await signOut(auth); // Firebase
    // await GoogleSignin.signOut(); // Google (ВАЖЛИВО)

    console.log('✅ Logged out');
  } catch (e) {
    console.log('❌ Logout error', e);
  }
}

// 🔄 Switch account (форсить popup)
export async function switchGoogleAccount() {
  try {
    console.log('🔄 Switching account...');

    await GoogleSignin.signOut(); // скидає кеш Google
    // далі запускаємо звичайний login
    const user = await signInWithGoogle();

    return user;
  } catch (e) {
    console.log('❌ Switch account error', e);
    throw e;
  }
}
