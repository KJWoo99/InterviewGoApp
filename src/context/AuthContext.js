import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 파일 자체 새로 추가

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('jwtToken');
        if (storedToken) {
          setToken(JSON.parse(storedToken));
        }
      } catch (e) {
        console.error('Failed to load the token.', e);
      }
    };
    loadToken();
  }, []);

  const saveToken = async (newToken) => {
    const tokenString = JSON.stringify(newToken);
    await AsyncStorage.setItem('jwtToken', tokenString);
    setToken(newToken);
  };

  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem('jwtToken');
      setToken(null);
    } catch (e) {
      console.error('Failed to remove the token.', e);
    }
  };

  return (
    <AuthContext.Provider value={{ token, saveToken, removeToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);