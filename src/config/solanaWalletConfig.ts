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


// import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks'
// import type { AppKitNetwork } from '@reown/appkit/networks'
// import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
// import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'


// // Get projectId from https://cloud.reown.com
// export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "b56e18d47c72ab683b10814fe9495694" // this is a public projectId only to use on localhost

// if (!projectId) {
//   throw new Error('Project ID is not defined')
// }

// export const networks = [solana, solanaTestnet, solanaDevnet] as [AppKitNetwork, ...AppKitNetwork[]]

// // Set up Solana Adapter
// export const solanaWeb3JsAdapter = new SolanaAdapter({
//   wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()]
// })