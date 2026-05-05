import {
  getAuth,
  signOut,
  GoogleAuthProvider,
  signInWithCredential,
  linkWithCredential,
} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import database from '@react-native-firebase/database';

const auth = getAuth();

export async function signInWithGoogle() {
  try {
    await GoogleSignin.hasPlayServices();

    const signInResult = await GoogleSignin.signIn();

    console.log('GOOGLE RESULT:', signInResult);

    if (signInResult.type !== 'success') {
      throw new Error('Google sign-in cancelled');
    }

    const idToken = signInResult.data?.idToken;
    const googleUser = signInResult.data.user;

    if (!idToken) {
      console.log('❌ INVALID GOOGLE RESULT:', signInResult);
      throw new Error('No idToken from Google');
    }

    const googleCredential = GoogleAuthProvider.credential(idToken);
    const currentUser = auth.currentUser;

    // 🔗 1. LINK (anonymous → Google)
    if (currentUser && currentUser.isAnonymous) {
      try {
        console.log('🔗 Linking anonymous → Google');

        const linkResult = await linkWithCredential(
          currentUser,
          googleCredential,
        );

        // ✅ update profile ПІСЛЯ link
        if (auth.currentUser) {
          await auth.currentUser.updateProfile({
            displayName: googleUser.name,
            photoURL: googleUser.photo,
          });
        }

        console.log('✅ LINKED USER:', linkResult.user.uid);

        return linkResult.user;
      } catch (e: any) {
        console.log('⚠️ LINK FAILED:', e.code);

        if (
          e.code === 'auth/email-already-in-use' ||
          e.code === 'auth/credential-already-in-use'
        ) {
          console.log('🔐 Signing in instead of linking');

          const signInRes = await signInWithCredential(auth, googleCredential);

          // ✅ update profile ПІСЛЯ signIn
          if (auth.currentUser) {
            await auth.currentUser.updateProfile({
              displayName: googleUser.name,
              photoURL: googleUser.photo,
            });
          }

          console.log('✅ SIGNED IN EXISTING USER:', signInRes.user.uid);

          return signInRes.user;
        }

        throw e;
      }
    }

    // 🔐 2. Звичайний login
    console.log('🔐 Signing in with Google');

    const signInRes = await signInWithCredential(auth, googleCredential);

    // ✅ update profile ПІСЛЯ signIn
    if (auth.currentUser) {
      await auth.currentUser.updateProfile({
        displayName: googleUser.name,
        photoURL: googleUser.photo,
      });
    }

    console.log('✅ GOOGLE USER:', signInRes.user.uid);

    return signInRes.user;
  } catch (e) {
    console.log('❌ Google sign-in error', e);
    throw e;
  }
}

// 🚪 Logout
export async function logout() {
  try {
    const user = auth.currentUser;

    console.log('🚪 Logging out...');

    // 🧹 Видаляємо anonymous користувача
    if (user?.isAnonymous) {
      console.log('🧹 Deleting anonymous user');
      await user.delete();
      return;
    }

    // 🔐 Google user logout
    await signOut(auth);
    await GoogleSignin.signOut();

    console.log('✅ Logged out');
  } catch (e) {
    console.log('❌ Logout error', e);
  }
}

// 🔄 Switch account
export async function switchGoogleAccount() {
  try {
    console.log('🔄 Switching account...');

    await GoogleSignin.signOut(); // тільки тут!

    return await signInWithGoogle();
  } catch (e) {
    console.log('❌ Switch account error', e);
    throw e;
  }
}

export async function ensureUserExists(uid: string) {
  const ref = database().ref(`/users/${uid}`);

  const snapshot = await ref.once('value');

  if (!snapshot.exists()) {
    console.log('🆕 Creating user in DB');

    await ref.set({
      role: 'user',
      createdAt: Date.now(),
    });
  }
}
