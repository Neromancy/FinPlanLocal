import React, { createContext, useContext, useState, useMemo } from 'react';
import LoadingOverlay from '../components/common/LoadingOverlay.tsx';

interface LoadingContextType {
  loadingMessage: string;
  setLoadingMessage: (message: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loadingMessage, setLoadingMessage] = useState('');

  const value = useMemo(() => ({ loadingMessage, setLoadingMessage }), [loadingMessage]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <LoadingOverlay />
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};