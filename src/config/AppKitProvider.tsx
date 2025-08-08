'use client';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  createAppKit,
} from '@reown/appkit/react';
import {
  SolanaAdapter,
} from '@reown/appkit-adapter-solana/react';
import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks';
// Using wallet adapters from AppKit adapter package to avoid version conflicts

// Replace with your Reown project ID
const PROJECT_ID = 'f325d70cabde57c85536722f0b6e724f';

interface AppKitContextType {
  isInitialized: boolean;
  appKitInstance: any;
}

const AppKitContext = createContext<AppKitContextType>({
  isInitialized: false,
  appKitInstance: null,
});

export const useAppKitContext = () => useContext(AppKitContext);

interface AppKitProviderProps {
  children: React.ReactNode;
}

export const AppKitProvider: React.FC<AppKitProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const appKitRef = useRef<any>(null);

  useEffect(() => {
    if (!appKitRef.current && typeof window !== 'undefined' && PROJECT_ID) {
      try {
        appKitRef.current = createAppKit({
          adapters: [
            new SolanaAdapter({
              wallets: [], // Empty wallets array for now to avoid version conflicts
            }),
          ],
          networks: [solana, solanaTestnet, solanaDevnet],
          metadata: {
            name: 'Yozoon',
            description: 'Yozoon Wallet Connection',
            url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
            icons: ['https://yozoon.com/icon.png'],
          },
          projectId: PROJECT_ID,
          features: {
            analytics: true,
            socials: [],
            email: false,
          },
        });
        
        console.log('AppKit initialized successfully');
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to create AppKit:', error);
      }
    }
  }, []);

  return (
    <AppKitContext.Provider value={{ isInitialized, appKitInstance: appKitRef.current }}>
      {children}
    </AppKitContext.Provider>
  );
}; 