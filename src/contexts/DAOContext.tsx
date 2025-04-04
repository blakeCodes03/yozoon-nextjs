// src/contexts/DAOContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface Proposal {
  id: string;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  status: 'pending' | 'approved' | 'rejected';
}

interface DAOContextProps {
  proposals: Proposal[];
  createProposal: (title: string, description: string) => Promise<void>;
  voteOnProposal: (proposalId: string, support: boolean) => Promise<void>;
}

const DAOContext = createContext<DAOContextProps | undefined>(undefined);

export const DAOProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);

  const fetchProposals = async () => {
    try {
      const response = await axios.get('/api/dao/proposals');
      setProposals(response.data);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    }
  };

  const createProposal = async (title: string, description: string) => {
    try {
      await axios.post('/api/dao/proposals', { title, description });
      await fetchProposals();
    } catch (error) {
      console.error('Error creating proposal:', error);
    }
  };

  const voteOnProposal = async (proposalId: string, support: boolean) => {
    try {
      await axios.post(`/api/dao/proposals/${proposalId}/vote`, { support });
      await fetchProposals();
    } catch (error) {
      console.error('Error voting on proposal:', error);
    }
  };

  return (
    <DAOContext.Provider value={{ proposals, createProposal, voteOnProposal }}>
      {children}
    </DAOContext.Provider>
  );
};

export const useDAO = () => {
  const context = useContext(DAOContext);
  if (!context) {
    throw new Error('useDAO must be used within a DAOProvider');
  }
  return context;
};
