import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  FirebaseAuthTypes,
} from '@react-native-firebase/auth';
import database, {FirebaseDatabaseTypes} from '@react-native-firebase/database';

import {View, ActivityIndicator} from 'react-native';

import {configureGoogleSignIn} from '../services/googleAuth';
import {ensureUserExists} from '../services/authService';

type UserRole = 'admin' | 'user';

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  role: UserRole | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
});

const auth = getAuth();

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  // 🔐 AUTH
  useEffect(() => {
    let isSigningIn = false;
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (u: FirebaseAuthTypes.User | null) => {
        console.log('AUTH STATE:', u?.uid ?? 'NO USER');

        if (!isMounted) return;

        if (!u) {
          if (isSigningIn) return;

          try {
            isSigningIn = true;

            console.log('🔐 Signing in anonymously...');
            const result = await signInAnonymously(auth);

            console.log('✅ NEW ANON USER:', result.user.uid);

            if (isMounted) {
              setUser(result.user);
            }
          } catch (e) {
            console.log('❌ Anonymous sign-in error', e);
          } finally {
            isSigningIn = false;
          }
        } else {
          if (isMounted) {
            setUser(u);
            await ensureUserExists(u.uid);
          }
        }

        if (isMounted) {
          setLoading(false);
        }
      },
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // 👤 ROLE
  useEffect(() => {
    setRole(null);

    if (!user) return;

    console.log('📡 Subscribing to role...');

    const ref = database().ref(`/users/${user.uid}/role`);

    const listener = ref.on(
      'value',
      (snapshot: FirebaseDatabaseTypes.DataSnapshot) => {
        const value = snapshot.val();

        console.log('👤 USER ROLE:', value);

        if (value === 'admin') {
          setRole('admin');
        } else {
          setRole('user');
        }
      },
    );

    return () => ref.off('value', listener);
  }, [user]);

  if (loading || !role) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{user, role}}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
