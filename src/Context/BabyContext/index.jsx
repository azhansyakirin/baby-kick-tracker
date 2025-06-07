import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from '../../config/firebase';
import { useAuth } from '../AuthContext';
import Cookies from 'js-cookie';

const BabyDataContext = createContext();

export const useBaby = () => useContext(BabyDataContext);

export const BabyDataProvider = ({ children }) => {
  const { user } = useAuth();
  const [babyName, setBabyName] = useState('');
  const [babyGender, setBabyGender] = useState('');
  const [kicks, setKicks] = useState([]);
  const [count, setCount] = useState(0);
  const updateTimeoutRef = useRef(null);

  useEffect(() => {
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

      Cookies.remove('babyName');
      Cookies.remove('kicks');
      Cookies.remove('count');
      Cookies.remove('countsByDate');
    };

    loadUserData();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    if (!babyName && kicks.length === 0 && !babyGender) return;

    handleDebouncedSave(kicks, babyName, babyGender);
  }, [kicks, babyName, babyGender, user]);

  const saveUserData = async (
    updatedKicks = kicks,
    updatedName = babyName,
    updatedGender = babyGender
  ) => {
    if (!user) return;

    console.log('📝 saveUserData CALLED with:', {
      updatedName,
      updatedGender,
      updatedKicks,
      parentName: user.name,
    });

    await setDoc(doc(db, 'users', user.uid), {
      babyName: updatedName ?? '',
      babyGender: updatedGender ?? '',
      kicks: updatedKicks ?? [],
      parentName: user.name ?? '',
    }, { merge: true });
  };



  const handleDebouncedSave = (updatedKicks) => {
    if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
    console.log('⏳ Debounced save triggered with kicks:', updatedKicks);
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
      }}
    >
      {children}
    </BabyDataContext.Provider>
  );
};
