import { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../AuthContext';

const AppointmentDataContext = createContext();

export const useAppointment = () => useContext(AppointmentDataContext);

export const AppointmentDataProvider = ({ children }) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const updateTimeoutRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const loadUserData = async () => {
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setAppointments(data.appointments || []);
      } else {
        await setDoc(userRef, {
          appointments: [],
          createdAt: Date.now(),
        });
      }
    };

    loadUserData();
  }, [user]);

  const saveUserData = async (updatedAppointments = appointments) => {
    if (!user) return;

    await setDoc(doc(db, 'users', user.uid), {
      appointments: updatedAppointments,
    }, { merge: true });
  };

  const saveAppointmentsDebounced = (updatedAppointments) => {
    if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
    updateTimeoutRef.current = setTimeout(() => {
      saveUserData(updatedAppointments);
    }, 500);
  };

  const addAppointment = (newAppointment) => {
    const updated = [...appointments, newAppointment];
    setAppointments(updated);
    saveAppointmentsDebounced(updated);
  };

  const deleteAppointment = (id) => {
    const updated = appointments.filter(app => app.id !== id);
    setAppointments(updated);
    saveAppointmentsDebounced(updated);
  };

  const updateAppointment = (id, updatedData) => {
    const updated = appointments.map(app => app.id === id ? { ...app, ...updatedData } : app);
    setAppointments(updated);
    saveAppointmentsDebounced(updated);
  };

  const value = useMemo(() => ({
    appointments,
    setAppointments,
    addAppointment,
    deleteAppointment,
    updateAppointment
  }), [appointments]);

  return (
    <AppointmentDataContext.Provider value={value}>
      {children}
    </AppointmentDataContext.Provider>
  );
};