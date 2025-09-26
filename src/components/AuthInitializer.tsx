import React, { useEffect, useState } from 'react';
import useAuthStore from '@/store/authStore';
export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const checkSession = useAuthStore((state) => state.checkSession);
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    const initialize = async () => {
      await checkSession();
      setInitialized(true);
    };
    initialize();
  }, [checkSession]);
  if (!initialized) {
    // You can return a global loading spinner here if you want
    return null;
  }
  return <>{children}</>;
};