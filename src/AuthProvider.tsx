import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { useStore } from './store/useStore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const store = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch or wait for profile info
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            store.setName(data.name);
            store.setAgeGroup(data.ageGroup);
            store.setNativeLanguage(data.nativeLanguage);
            store.setParentalPin(data.parentalPin || null);
            store.setScreenTimeLimit(data.screenTimeLimit || null);
            store.setDisabledModules(data.disabledModules || []);
            store.setIsFirstLogin(false);
          } else {
            // Profile doesn't exist yet, we remain in FirstLogin
            store.setIsFirstLogin(true);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        store.setIsFirstLogin(true);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}
