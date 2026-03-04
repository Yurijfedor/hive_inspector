import React, {createContext, useContext, useEffect, useState} from 'react';
import {onAuthStateChanged, signInAnonymously, User} from 'firebase/auth';
import {auth} from '../firebase/firebase';

type AuthContextType = {
  user: User | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      if (!u) {
        const result = await signInAnonymously(auth);
        setUser(result.user);
      } else {
        setUser(u);
      }

      setLoading(false);
    });

    return unsub;
  }, []);

  if (loading) {
    return null;
  }

  return <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
