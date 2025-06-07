// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { getDeviceType } from '../../utils/getDeviceType';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [deviceType, setDeviceType] = useState(null);

  useEffect(() => {
    const cookieUser = Cookies.get('user');

    const device = getDeviceType();

    if (cookieUser) {
      try {
        setUser(JSON.parse(cookieUser));
        setDeviceType(device);
      } catch (e) {
        console.error('Failed to parse user cookie', e);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, deviceType, setDeviceType }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
