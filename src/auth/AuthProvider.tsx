import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  FirebaseAuthTypes,
} from '@react-native-firebase/auth';

import {View, ActivityIndicator} from 'react-native';

import {configureGoogleSignIn} from '../services/googleAuth';

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
});

const auth = getAuth();

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Google Sign-In init (1 раз при старті)
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

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

  // ✅ Нормальний loading UI
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }

  return <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
