import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import { useConnect, Connector } from 'wagmi';
import { toast } from 'react-toastify';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProps } from './types';
import Image from 'next/image';
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react';
import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { createAppKit } from '@reown/appkit/react';

Modal.setAppElement('#__next');

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onRequestClose }) => {
  const { connect, connectors, error } = useConnect();
  const { wallets: solanaWallets, select, connected: isSolanaConnected, publicKey } = useWallet();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pendingConnector, setPendingConnector] = useState<Connector | null>(null);

  const [detectedWallets, setDetectedWallets] = useState<Record<string, boolean>>({});
  const [appKitInitialized, setAppKitInitialized] = useState<any>(null);

  const walletLogos: Record<string, string> = {
    MetaMask: '/assets/wallet_icons/metamask.svg',
    WalletConnect: '/assets/wallet_icons/walletconnect.svg',
    Phantom: '/assets/wallet_icons/phantom.svg',
    Solflare: '/assets/wallet_icons/solflare.svg',
  };

  useEffect(() => {
    const detection: Record<string, boolean> = {};
    connectors.forEach((connector) => {
      detection[connector.name] = connector.ready;
    });
    solanaWallets.forEach((wallet) => {
      detection[wallet.adapter.name] = wallet.ready;
    });
    setDetectedWallets(detection);
  }, [connectors, solanaWallets]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const projectId = 'YOUR_PROJECT_ID'; // Replace with actual projectId
      const kit = createAppKit({
        adapters: [
          new SolanaAdapter({
            wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
          }),
        ],
        networks: [solana, solanaTestnet, solanaDevnet],
        // metadata: {
        //   name: 'Cryptowny',
        //   description: 'Cryptowny Wallet Connection',
        //   url: 'https://yourapp.com',
        //   icons: ['https://yourapp.com/icon.png'],
        // },
        projectId,
        features: {
          analytics: true,
        },
      });
      setAppKitInitialized(kit);
    }
  }, []);

  const saveWalletAddressToDatabase = async (address: string, chain: 'evm' | 'solana') => {
    try {
      const response = await fetch('/api/users/save-wallet-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, chain }),
      });
      if (!response.ok) {
        const data = await response.json();
        console.error('Failed to save wallet address:', data.message);
      }
    } catch (error) {
      console.error('Error saving wallet address:', error);
    }
  };

  const handleEVMConnect = async (connector: Connector) => {
    setIsLoading(true);
    setPendingConnector(connector);
    try {
      const result = await connect({ connector });
      if (result) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const address = result.account;
        await saveWalletAddressToDatabase(address, 'evm');
        toast.success(`Connected with ${connector.name}`);
        onRequestClose();
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to connect wallet.');
    } finally {
      setIsLoading(false);
      setPendingConnector(null);
    }
  };

  const handleSolanaConnect = async (walletName: string) => {
    setIsLoading(true);
    try {
      await select(walletName);
      await new Promise<void>((resolve, reject) => {
        const checkConnected = () => {
          if (isSolanaConnected) {
            resolve();
          }
        };
        const interval = setInterval(checkConnected, 100);
        setTimeout(() => {
          clearInterval(interval);
          reject(new Error('User did not connect the wallet'));
        }, 60000);
      });
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (publicKey) {
        const address = publicKey.toBase58();
        await saveWalletAddressToDatabase(address, 'solana');
        toast.success(`Connected with ${walletName}`);
        onRequestClose();
      }
    } catch (error) {
      console.error('Solana Wallet Connection Error:', error);
      toast.error(`Failed to connect to ${walletName}.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal-content bg-bg1 text-textPrimary rounded-lg shadow-lg p-6 relative"
      overlayClassName="modal-overlay"
      contentLabel="Connect Wallet"
    >
      <button
        onClick={onRequestClose}
        className="absolute top-2 right-2 text-textDisabled hover:text-textSecondary"
        aria-label="Close Modal"
      >
        <FaTimes />
      </button>

      {/* Add the official appKit button */}
      <div className="mb-4 text-center">
        <appkit-button view="Connect"></appkit-button>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-center">Connect a wallet</h2>
      <div className="space-y-4">
        {[
          ...connectors.filter((connector) => ['metaMask', 'walletConnect'].includes(connector.id)),
          ...solanaWallets,
        ].map((wallet) => {
          const isEVM = 'id' in wallet;
          const walletName = isEVM ? wallet.name : wallet.adapter.name;
          const isDetected = detectedWallets[walletName];
          const logoSrc = walletLogos[walletName] || '/assets/wallet_icons/default.svg';

          return (
            <button
              key={walletName}
              onClick={() => isEVM ? handleEVMConnect(wallet as Connector) : handleSolanaConnect(walletName)}
              className="w-full flex items-center justify-between px-4 py-2 bg-gray-700 hover:bg-accentBlue rounded-md shadow transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Image src={logoSrc} alt={`${walletName} Logo`} width={24} height={24} />
                <span>{walletName}</span>
              </div>
              <div className="flex items-center space-x-2">
                {isDetected && <span className="text-sm text-green-500">Detected</span>}
                {/* If not detected, show nothing */}
                {isLoading && pendingConnector?.name === walletName && (
                  <svg className="animate-spin h-5 w-5 ml-3 text-white" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                )}
              </div>
            </button>
          );
        })}
        {error && <div className="text-red-500 mt-2 text-center">{error.message}</div>}
      </div>

      <p className="mt-4 text-center text-sm text-gray-500">
        By connecting a wallet, you agree to Cryptowny's{' '}
        <a href="/terms" className="text-accentBlue underline">
          Terms of Service
        </a>{' '}
        and consent to its{' '}
        <a href="/privacy" className="text-accentBlue underline">
          Privacy Policy
        </a>
        .
      </p>
    </Modal>
  );
};

export default WalletModal;
