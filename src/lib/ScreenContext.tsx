import React, { createContext, useContext, ReactNode } from 'react';
import { ScreenData } from '../types';
import { useScreenData as useScreenDataHook } from './useScreenData';

interface ScreenContextType {
  screenId: string;
  data: ScreenData | null;
  loading: boolean;
  error: Error | null;
  updateScreenData: (newData: Partial<ScreenData>) => Promise<void>;
}

const ScreenContext = createContext<ScreenContextType | undefined>(undefined);

export function ScreenProvider({ screenId, children }: { screenId: string, children: ReactNode }) {
  const { data, loading, error, updateScreenData } = useScreenDataHook(screenId);

  return (
    <ScreenContext.Provider value={{ screenId, data, loading, error, updateScreenData }}>
      {children}
    </ScreenContext.Provider>
  );
}

export function useScreenContext() {
  const context = useContext(ScreenContext);
  if (context === undefined) {
    throw new Error('useScreenContext must be used within a ScreenProvider');
  }
  return context;
}
