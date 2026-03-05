import React, {createContext, useContext, useEffect, useState} from 'react';

import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  FirebaseAuthTypes,
} from '@react-native-firebase/auth';

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (u: FirebaseAuthTypes.User | null) => {
        console.log('AUTH STATE:', u?.uid ?? 'NO USER');

        if (!u) {
          console.log('Signing in anonymously...');
          const result = await signInAnonymously(auth);
          console.log('NEW USER:', result.user.uid);
          setUser(result.user);
        } else {
          setUser(u);
        }

        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  if (loading) return null;

  return <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
