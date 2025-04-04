'use client';
import {
  useDisconnect,
  useAppKit,
  useAppKitNetwork,
  useAppKitAccount
} from '@reown/appkit/react';

// import { networks } from '@/config/solanaWalletConfig'


type EmbeddedWalletInfo = {
  user: {
    username: string
    email: string
  },
  
}

type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'reconnecting'

type UseAppKitAccountReturnType = {
  isConnected: boolean
  status?: ConnectionStatus
  address?: string
  caipAddress?: `${string}:${string}`
  embeddedWalletInfo?: EmbeddedWalletInfo
}

export const ActionButtonList = () => {
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const { switchNetwork } = useAppKitNetwork();
  const { address, isConnected, caipAddress, status, embeddedWalletInfo } =
  useAppKitAccount();

  
  return (
    <div>
      {/* when connected show username or view wallet */}
      <a
        className="transition-all duration-300 cursor-pointer ease-in-out bg-[#FFB92D] hover:bg-[#826327] text-[#121212] text-[13px] font-[900] rounded-md  px-5 py-[10px]"
        onClick={() => open()}
      >
        {isConnected ? (embeddedWalletInfo?.user?.username || "View Wallet") : "Connect Wallet"}
      </a>
      
    </div>
  );
};
