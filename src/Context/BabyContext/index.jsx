import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from '../../config/firebase';
import { useAuth } from '../AuthContext';
import { addPoopLog } from '../../services/addPoopLog';
import { getPoopLog } from '../../services/getPoopLog';
import { deletePoopLog } from '../../services/deletePoopLog';
import toast from 'react-hot-toast';

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
  const [babyPoopLogs, setBabyPoopLogs] = useState([]);

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
        setBabyPoopLogs(data.babyPoopLogs || []);
      } else {
        await setDoc(userRef, {
          babyName: '',
          babyGender: '',
          kicks: [],
          babyPoopLogs: [],
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
    updatedGender = babyGender,
    updatedPoopLogs = babyPoopLogs,
  ) => {
    if (!user) return;

    await setDoc(doc(db, 'users', user.uid), {
      babyName: updatedName ?? '',
      babyGender: updatedGender ?? '',
      kicks: updatedKicks ?? [],
      parentName: user.name ?? '',
      babyPoopLogs: updatedPoopLogs ?? [],
    }, { merge: true });
  };

  const handleDebouncedSave = (updatedKicks) => {
    if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
    updateTimeoutRef.current = setTimeout(() => {
      saveUserData(updatedKicks);
    }, 500);
  };

  const refreshPoopLogs = async (userId) => {
    const logs = await getPoopLog(userId);
    setBabyPoopLogs(logs);
  };

  const handleAddNewPoopLog = async (newLog) => {
    setBabyPoopLogs(prev => [...prev, newLog]);
    await addPoopLog(user.uid, newLog);
    toast.success(`Log ${newLog.date} at ${newLog.time} added successfully`);
    await refreshPoopLogs(user.uid);
  };

  const handleDeletePoopLog = async (logid) => {
    setBabyPoopLogs(prev => prev.filter((_, i) => i !== logid));
    const matchedLog = babyPoopLogs.find((log, i) => log.id === logid);
    await deletePoopLog(user.uid, logid);
    toast.success(`Log ${matchedLog.date} at ${matchedLog.time} deleted successfully`);
    await refreshPoopLogs(user.uid);
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
        babyPoopLogs,
        handleAddNewPoopLog,
        handleDeletePoopLog,
      }}
    >
      {children}
    </BabyDataContext.Provider>
  )
}
