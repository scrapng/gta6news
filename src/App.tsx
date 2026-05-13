import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { RootLayout } from './RootLayout';
import { useAppStore } from '@store/appStore';
import { userAPI } from '@services/api';

export const App: React.FC = () => {
  const setUser = useAppStore((state) => state.setUser);
  const setWallet = useAppStore((state) => state.setWallet);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const user = await userAPI.getCurrentUser();
      const wallet = await userAPI.getWallet(user.id);

      setUser(user);
      setWallet(wallet);
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      <RootLayout />
    </>
  );
};
