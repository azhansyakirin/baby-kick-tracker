// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { getDeviceType } from '../../utils/getDeviceType';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [deviceType, setDeviceType] = useState(null);

  useEffect(() => {
    const device = getDeviceType();
    setDeviceType(device);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, deviceType, setDeviceType }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
