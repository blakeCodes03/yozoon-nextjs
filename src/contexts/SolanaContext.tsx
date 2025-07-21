import React, { createContext, useContext } from 'react';
import type { AnchorProvider } from '@project-serum/anchor';
import type { Connection } from '@solana/web3.js';

// You can extend this type if you want to add more fields
export type SolanaContextType = {
  connection: Connection | null;
  provider: AnchorProvider | null;
  wallet: any | null;
};

export const SolanaContext = createContext<SolanaContextType>({
  connection: null,
  provider: null,
  wallet: null,
});

export const useSolana = () => useContext(SolanaContext);
