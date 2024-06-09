import React, { createContext, useState, ReactNode, useContext } from 'react';
import { HumeMessage } from '../structs/chat.interface';

interface AppContextType {
  humeChat: HumeMessage[];
  setHumeChat: React.Dispatch<React.SetStateAction<HumeMessage[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [humeChat, setHumeChat] = useState<HumeMessage[]>([]);

  return (
    <AppContext.Provider value={{ humeChat, setHumeChat }}>
      {children}
    </AppContext.Provider>
  );
};
