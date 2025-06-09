import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from '../../config/firebase';
import { useAuth } from '../AuthContext';

const BabyDataContext = createContext();

export const useBaby = () => useContext(BabyDataContext);

export const BabyDataProvider = ({ children }) => {
  const { user } = useAuth();
  const [babyName, setBabyName] = useState('');
  const [babyGender, setBabyGender] = useState('');
  const [kicks, setKicks] = useState([]);
  const [count, setCount] = useState(0);
  const updateTimeoutRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true)
    if (!user) { console.log("No User Data"); return };

    const loadUserData = async () => {
      const userId = user.uid;
      const userRef = doc(db, 'users', userId);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setBabyName(data.babyName || '');
        setBabyGender(data.babyGender || '');
        setKicks(data.kicks || []);
        setCount((data.kicks || []).length);
      } else {
        await setDoc(userRef, {
          babyName: '',
          babyGender: '',
          kicks: [],
          parentName: user.displayName || '',
          createdAt: Date.now(),
        });
      }
      setLoading(false);
    };

    loadUserData();
  }, [user]);

  useEffect(() => {
    if (!user || !loading) return;

    const hasData =
      babyName.trim() !== '' || babyGender.trim() !== '' || kicks.length > 0;

    if (hasData) {
      handleDebouncedSave(kicks, babyName, babyGender);
    }
  }, [kicks, babyName, babyGender, user, loading]);

  const saveUserData = async (
    updatedKicks = kicks,
    updatedName = babyName,
    updatedGender = babyGender
  ) => {
    if (!user) return;

    await setDoc(doc(db, 'users', user.uid), {
      babyName: updatedName ?? '',
      babyGender: updatedGender ?? '',
      kicks: updatedKicks ?? [],
      parentName: user.name ?? '',
    }, { merge: true });
  };

  const handleDebouncedSave = (updatedKicks) => {
    if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
    updateTimeoutRef.current = setTimeout(() => {
      saveUserData(updatedKicks);
    }, 500);
  };

  return (
    <BabyDataContext.Provider
      value={{
        babyName,
        setBabyName,
        babyGender,
        setBabyGender,
        kicks,
        setKicks,
        saveUserData,
        handleDebouncedSave,
        count,
        setCount,
        loading,
      }}
    >
      {children}
    </BabyDataContext.Provider>
  )
}
