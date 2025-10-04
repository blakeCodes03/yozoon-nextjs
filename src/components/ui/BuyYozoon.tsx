import React, { useState, useEffect, ChangeEvent, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from '@/components/ui/sheet';
import { useProgramUser } from "../../hooks/useProgram";
import {
  useAppKitAccount,
  useAppKitProvider,
} from '@reown/appkit/react';
import type { Provider } from "@reown/appkit-adapter-solana/react";
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getBondingCurvePDA, getConfigPDA } from '@/utils/config';
import { uploadYozoonUri } from '@/lib/pinata';
import { buyYozoon } from '@/services/token-mill/services/buyYozoon';
import { connection } from '@/lib/connection';
import { toast } from 'react-toastify';

interface QuickBuySideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const BuyYozoon: React.FC<QuickBuySideDrawerProps> = ({ isOpen, onClose }) => {
  const [value, setValue] = useState('');
  const [solBalance, setSolBalance] = useState(0);
  const [selectedBuySol, setSelectedBuySol] = useState<number | null>(null);
  const [fetchingBalance, setFetchingBalance] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const exchangeRate = 100; // 1 SOL = 100 YOZN
  const solOptions = [0.1, 0.5, 1];

  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Provider>("solana");
  const program = useProgramUser(walletProvider, isConnected);

  // Derived values
  const selectedAmount = useMemo(
    () => selectedBuySol || parseFloat(value) || 0,
    [selectedBuySol, value]
  );

  const yozoonAmount = useMemo(
    () => selectedAmount * exchangeRate,
    [selectedAmount, exchangeRate]
  );

  // Fetch SOL balance
  useEffect(() => {
    if (!address || !isConnected) return;

    const pubkey = new PublicKey(address);

    const fetchBalance = async () => {
      setFetchingBalance(true);
      try {
        const balance = await connection.getBalance(pubkey);
        setSolBalance(balance / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error('Error fetching balance:', error);
      } finally {
        setFetchingBalance(false);
      }
    };

    fetchBalance();
  }, [address, isConnected]);

  // Handlers
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (/^\d*\.?\d*$/.test(inputValue)) {
      setValue(inputValue);
      setSelectedBuySol(null);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData('text');
    if (!/^\d*\.?\d*$/.test(pastedData)) {
      e.preventDefault();
    }
  };

  const handleSelectSol = (sol: number | null) => {
    setSelectedBuySol(sol);
    setValue(sol ? sol.toString() : '');
  };

  const resetSelection = () => {
    setSelectedBuySol(null);
    setValue('');
  };

  const handleBuy = async () => {
    setErrorMsg(null);

    if (!address || !isConnected) {
      setErrorMsg("Wallet not connected");
      return;
    }
    if (!program) {
      setErrorMsg("Program not initialized");
      return;
    }
    if (selectedAmount <= 0) {
      setErrorMsg("Please select an amount to buy");
      return;
    }

    try {
      setLoading(true);

      const pubkey = new PublicKey(address);
      const solAmount = Math.floor(selectedAmount * LAMPORTS_PER_SOL);

      const solBalanceLamports = Math.floor(solBalance * LAMPORTS_PER_SOL);


      if (solBalanceLamports < solAmount) {
        toast.error("Insufficient SOL balance");
        return;
      }


      const { configPDA } = await getConfigPDA();
      const { bondingCurvePDA } = await getBondingCurvePDA();
      const configAccount = await (program.account as any).config.fetch(configPDA);

      const { mint: yozoonMint, treasury } = configAccount;

      const uri = await uploadYozoonUri({
        name: "Yozoon",
        symbol: "YOZOON",
        description: "A unique Solana Launchpad Token",
        imageUri: "https://olive-implicit-cuckoo-338.mypinata.cloud/ipfs/bafkreifqsooouzmpt5xfmafp6a4jh3sx37r2ys6bxycdni72mb6qcqorna",
      });

      if (!uri) throw new Error("Failed to upload metadata");

      const txSig = await buyYozoon({
        program,
        wallet: pubkey,
        configPDA,
        bondingCurvePDA,
        yozoonMint,
        treasury,
        solAmount,
        yozoonName: "Yozoon",
        yozoonSymbol: "YOZOON",
        yozoonUri: uri,
      });

      toast.success("Yozoon purchase successful!");
      console.log("✅ Transaction signature:", txSig);
      resetSelection();
    } catch (err: any) {
      console.error("❌ Transaction failed:", err);
      setErrorMsg(err.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1E2329] w-80 dark:bg-gray-800 shadow-lg">
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent>
          <SheetHeader>
            <h5 className="mt-10 mb-1 text-white font-bold text-[20px]">
              Buy Yozoon
            </h5>
            <SheetDescription>
              Purchase Yozoon tokens quickly and easily using SOL.
            </SheetDescription>
          </SheetHeader>

          {/* Input field */}
          <div className="border-2 border-[#37393E] rounded-lg p-2 mt-10">
            <div className="flex items-center justify-between">
              <input
                type="number"
                value={value}
                onChange={handleInput}
                onPaste={handlePaste}
                className="flex-1 w-full text-xl p-2 bg-inherit rounded-md text-white border-none focus:outline-none"
                placeholder="0"
              />
              <div className="flex items-center gap-2">
                <img src="/assets/icons/solana.png" className="w-5 h-5" />
                <span className="text-xl">SOL</span>
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="flex items-center justify-end gap-2 my-5 text-gray-400">
            <img className="w-4 h-4" src="/assets/wallet_icons/wallet-svg.svg" />
            <span className="text-sm">
              {fetchingBalance ? "Loading..." : solBalance.toFixed(4)} SOL
            </span>
          </div>

          {/* Quick select buttons */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <button
              onClick={resetSelection}
              className="px-4 py-2 text-base font-bold text-gray-400 border-2 hover:border-[#F6E05E] transition-all"
            >
              Reset
            </button>
            {solOptions.map((sol) => (
              <button
                key={sol}
                onClick={() => handleSelectSol(sol)}
                className={`px-4 py-2 w-full font-bold border-2 transition-all
                  ${selectedBuySol === sol ? "border-[#F6E05E] bg-gray-700" : "bg-gray-900 border-transparent"}
                `}
              >
                {sol}
              </button>
            ))}
          </div>

          {/* Output */}
          <div className="border-t-2 border-[#37393E] rounded-md p-2 my-5">
            <div className="flex items-center justify-between text-lg">
              <span className="font-bold">You Receive</span>
              <div>
                <span>{yozoonAmount.toLocaleString()}</span>
                <span className="ml-2 text-xs">YOZN</span>
              </div>
            </div>
          </div>

          {/* Error */}
          {errorMsg && (
            <p className="text-red-400 text-sm mt-2">{errorMsg}</p>
          )}

          {/* Buy button */}
          <div className="mt-10 px-5">
            <button
              onClick={handleBuy}
              disabled={loading || selectedAmount <= 0}
              className="bg-[#FFB92D] disabled:opacity-50 w-full rounded-lg px-5 py-2 text-black font-bold text-sm"
            >
              {loading ? "Processing..." : "Buy Yozoon"}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default BuyYozoon;
