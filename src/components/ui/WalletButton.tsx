import React, { useEffect, useState } from 'react';
import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { toast } from 'react-toastify';
import WalletModal from './WalletModal';
import { useWallet } from '@solana/wallet-adapter-react';
import { FaWallet } from 'react-icons/fa';
import { mainnet } from 'wagmi/chains';
import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';

const WalletButton: React.FC = () => {
  const {
    address: evmAddress,
    isConnected: isEVMConnected,
    connector,
  } = useAccount();
  const { disconnect: disconnectEVM } = useDisconnect();
  const {
    publicKey,
    connected: isSolanaConnected,
    disconnect: disconnectSolana,
    wallet,
  } = useWallet();

  const [isClient, setIsClient] = useState<boolean>(false);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  // EVM balance
  const { data: evmBalance } = useBalance({
    address: evmAddress,
    chainId: mainnet.id,
    // 'enabled' is added in some wagmi versions; cast to any to remain compatible
    enabled: !!evmAddress && isEVMConnected,
  } as unknown as any);

  // Solana balance
  const [solBalance, setSolBalance] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchSolBalance = async () => {
      if (isSolanaConnected && publicKey) {
        try {
          const connection = new Connection(clusterApiUrl('mainnet-beta'));
          const lamports = await connection.getBalance(publicKey);
          const sol = lamports / LAMPORTS_PER_SOL;
          setSolBalance(sol.toFixed(4)); // 4 decimal places
        } catch (error) {
          console.error('Error fetching Solana balance:', error);
          setSolBalance('N/A');
        }
      } else {
        setSolBalance(null);
      }
    };
    fetchSolBalance();
  }, [isSolanaConnected, publicKey]);

  const handleDisconnectWallet = () => {
    if (isEVMConnected) {
      disconnectEVM();
      toast.info('EVM Wallet disconnected');
    }
    if (isSolanaConnected) {
      disconnectSolana();
      toast.info('Solana Wallet disconnected');
    }
    setShowDetails(false);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleWalletButtonClick = () => {
    if (isEVMConnected || isSolanaConnected) {
      setShowDetails((prev) => !prev);
    } else {
      openModal();
    }
  };

  if (!isClient) {
    return null;
  }

  let content;
  if (isEVMConnected && evmAddress && connector) {
    // EVM connected
    const shortAddress = `${evmAddress.substring(0, 6)}...${evmAddress.substring(evmAddress.length - 4)}`;
    content = (
      <div className="relative inline-block">
        <button
          onClick={handleWalletButtonClick}
          className="flex items-center bg-bg3 text-textPrimary px-3 py-2 rounded hover:bg-bg4 transition-colors"
          title="Click to view details"
        >
          <FaWallet className="mr-2" />
          {shortAddress}
        </button>
        {showDetails && (
          <div className="absolute left-0 mt-2 w-48 bg-bg1 border border-gray-200 rounded-md shadow-lg py-2 z-50">
            <div className="px-4 py-2 text-textPrimary">
              <p className="text-sm">
                Balance:{' '}
                {evmBalance
                  ? `${evmBalance.formatted} ${evmBalance.symbol}`
                  : '...'}{' '}
              </p>
            </div>
            <button
              onClick={handleDisconnectWallet}
              className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  } else if (isSolanaConnected && publicKey && wallet) {
    // Solana connected
    const address = publicKey.toBase58();
    const shortAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

    content = (
      <div className="relative inline-block">
        <button
          onClick={handleWalletButtonClick}
          className="flex items-center bg-bg3 text-textPrimary px-3 py-2 rounded hover:bg-bg4 transition-colors"
          title="Click to view details"
        >
          <FaWallet className="mr-2" />
          {shortAddress}
        </button>
        {showDetails && (
          <div className="absolute left-0 mt-2 w-48 bg-bg1 border border-gray-200 rounded-md shadow-lg py-2 z-50">
            <div className="px-4 py-2 text-textPrimary">
              <p className="text-sm">
                Balance: {solBalance !== null ? `${solBalance} SOL` : '...'}{' '}
              </p>
            </div>
            <button
              onClick={handleDisconnectWallet}
              className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  } else {
    // Not connected
    content = (
      <>
        <button
          onClick={handleWalletButtonClick}
          className="flex items-center bg-bg3 text-textPrimary px-3 py-2 rounded hover:bg-accentBlue transition-colors"
        >
          <FaWallet className="mr-2" />
          Connect Wallet
        </button>
        <WalletModal isOpen={modalIsOpen} onRequestClose={closeModal} />
      </>
    );
  }

  return content;
};

export default WalletButton;
