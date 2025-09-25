import React, { useState } from 'react';
import { useWallet, useAnchorWallet,  WalletContextState  } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';
import { Wallet } from '@coral-xyz/anchor';


// import {
//   connectionService,
//   tokenCreationService,
//   tokenTradingService,
//   priceService
// } from '../../token-mill/services';
import {
  connectionService,
  priceService,
  tokenCreationService,
} from '@/services/token-mill/services';

const BuyYozoonToken: React.FC = () => {
  const [selectedSol, setSelectedSol] = useState<number | null>(null);
  const [yozoonBalance, setYozoonBalace] = useState(100); // yozoon token balance from wallet
  const [yozoonPrice, setYozoonPrice] = useState(0.01); // Yozoon token price from wallet
  const [solBalance, setSolBalance] = useState(10); // sol balance from wallet
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  const [loading, setLoading] = useState(false);

  const { connected, publicKey, select, wallets } = useWallet();

  // const wallet = useWallet() as WalletContextState & { adapter: Wallet | null };
  // console.log('🌐 Wallet info:', wallet.adapter);

  // const wallet = useAnchorWallet();

  // useEffect(() => {
  //   if (connected && publicKey) {
  //     select(wallets[0]?.adapter.name);
  //     console.log('🔑 Connected wallet:', publicKey.toBase58());
  //   }
  // }, [publicKey]);

  // useEffect(() => {
  //   if (connected && wallet) {

   

  //   connectionService.connectWallet(wallet);

  //     // Now you can use other services
  //     const getPrice = async () => {
  //       const price = await priceService.getYozoonTokenPrice();
  //       console.log(`Current YOZOON price: ${price} SOL`);
  //     };

  //     getPrice();
  //   }
  // }, [connected, wallet, publicKey]);

  const solOptions = [0.1, 0.5, 1]; // Fixed SOL amounts
  const exchangeRate = 100; // 1 SOL = 100 Yozoon tokens, should be fetched

  // Handle SOL amount selection
  const handleSelectSol = (sol: number | null) => {
    setSelectedSol(sol);
  };

  // Increment through fixed SOL amounts
  const handleIncrement = () => {
    if (selectedSol === null) {
      setSelectedSol(solOptions[0]); // Start at 0.1 SOL
    } else {
      const currentIndex = solOptions.indexOf(selectedSol);
      const nextIndex = (currentIndex + 1) % solOptions.length;
      setSelectedSol(solOptions[nextIndex]);
    }
  };

  // Decrement through fixed SOL amounts
  const handleDecrement = () => {
    if (selectedSol === null) {
      setSelectedSol(solOptions[solOptions.length - 1]); // Start at 1 SOL
    } else {
      const currentIndex = solOptions.indexOf(selectedSol);
      const prevIndex =
        (currentIndex - 1 + solOptions.length) % solOptions.length;
      setSelectedSol(solOptions[prevIndex]);
    }
  };

  // Calculate Yozoon token equivalent
  const yozoonTokens = selectedSol
    ? (selectedSol * exchangeRate).toFixed(0)
    : '0';

  const isValid = selectedSol !== null; // Purchase button enabled only if SOL is selected

  // Simulate purchase
  const handlePurchase = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (Math.random() > 0.5) {
        setShowSuccess(true);
      } else {
        setShowFailed(true);
      }
    }, 2000);
  };

  return (
    <div className="bg-[#1A202C] text-white p-5 rounded-[10px] max-w-2xl mx-auto font-inter">
      <h2 className="text-2xl font-bold mb-5 text-center">Buy Yozoon Token</h2>

      {/* SOL Selection Section */}
      <div className="mb-5">
        <label className="text-base font-bold block mb-2">
          Select SOL Amount
        </label>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => handleSelectSol(null)}
            className="px-4 py-2 rounded-[8px] text-base font-bold bg-[#2D3748] text-white"
          >
            Reset
          </button>
          {solOptions.map((sol) => (
            <button
              key={sol}
              onClick={() => handleSelectSol(sol)}
              className={`px-4 py-2 rounded-[8px] text-base font-bold ${
                selectedSol === sol
                  ? 'bg-[#F6E05E] text-black'
                  : 'bg-[#2D3748] text-white'
              }`}
            >
              {sol} SOL
            </button>
          ))}
        </div>
      </div>

      {/* Immutable Yozoon Token Equivalent */}
      <div className="mb-5">
        <label className="text-base font-bold block mb-2">You Receive</label>
        <div className="text-center text-xl p-2 bg-[#2D3748] rounded-[5px]">
          {yozoonTokens} Yozoon
        </div>
      </div>

      {/* Increment and Decrement Buttons */}
      <div className="flex justify-center gap-4 mb-5">
        <button
          onClick={handleDecrement}
          className="w-10 h-10 rounded-full bg-white text-gray-600 text-xl flex items-center justify-center cursor-pointer"
        >
          −
        </button>
        <button
          onClick={handleIncrement}
          className="w-10 h-10 rounded-full bg-white text-gray-600 text-xl flex items-center justify-center cursor-pointer"
        >
          +
        </button>
      </div>

      {/* Balance and Purchase Button */}
      <div className="text-base mb-5 text-center">
        Current Yozoon Balance: {yozoonBalance}
      </div>
      <button
        className="py-2 px-4 rounded-[8px] text-base font-bold flex items-center justify-center ml-auto bg-[#F6E05E] text-black disabled:bg-[#A0AEC0] disabled:cursor-not-allowed"
        disabled={!isValid || loading}
        onClick={handlePurchase}
      >
        {loading ? 'Processing...' : 'Purchase'} ⚡
      </button>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-black p-5 rounded-[10px] text-center">
            <h3 className="text-xl font-bold">Success!</h3>
            <p className="text-base">Your purchase was successful.</p>
            <button
              className="mt-4 px-4 py-2 bg-gray-200 text-black rounded-[8px]"
              onClick={() => setShowSuccess(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Failed Modal */}
      {showFailed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-black p-5 rounded-[10px] text-center">
            <h3 className="text-xl font-bold">Failed</h3>
            <p className="text-base">Your purchase failed. Please try again.</p>
            <button
              className="mt-4 px-4 py-2 bg-gray-200 text-black rounded-[8px]"
              onClick={() => setShowFailed(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyYozoonToken;
