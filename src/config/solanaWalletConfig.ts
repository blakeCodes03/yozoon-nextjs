"use client";
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';

export const solanaWallets = () => {
  // const network = WalletAdapterNetwork.Mainnet; 
  const network = WalletAdapterNetwork.Devnet; // Change this to mainnet for production
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ];
  return { wallets };
};


