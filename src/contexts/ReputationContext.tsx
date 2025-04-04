// src/contexts/ReputationContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface ReputationContextProps {
  reputation: number;
  updateReputation: (delta: number) => Promise<void>;
}

const ReputationContext = createContext<ReputationContextProps | undefined>(undefined);

export const ReputationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reputation, setReputation] = useState<number>(0);

  const updateReputation = async (delta: number) => {
    try {
      const response = await axios.post('/api/users/update-reputation', { delta });
      setReputation(response.data.reputation);
    } catch (error) {
      console.error('Error updating reputation:', error);
    }
  };

  return (
    <ReputationContext.Provider value={{ reputation, updateReputation }}>
      {children}
    </ReputationContext.Provider>
  );
};

export const useReputation = () => {
  const context = useContext(ReputationContext);
  if (!context) {
    throw new Error('useReputation must be used within a ReputationProvider');
  }
  return context;
};
