import React, {useState, useEffect, ChangeEvent} from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface QuickBuySideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const BuyYozoon: React.FC<QuickBuySideDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [value, setValue] = useState('');
    const [solBalance, setSolBalance] = useState(100); // Example balance, should fetch real balance from wallet
      const [selectedBuySol, setSelectedBuySol] = React.useState<number | null>(null);
    
  

      const solOptions = [0.1, 0.5, 1]; // Quantity to buy in SOL [0.1 sol, 0.5 sol, 1 sol]


  const handleInput = (
      e: ChangeEvent<HTMLInputElement>    
    ) => {
      const inputValue = e.target.value;
      // Allow only numbers and decimal point (optional)
      if (/^\d*\.?\d*$/.test(inputValue)) {
        setValue(inputValue);
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pastedData = e.clipboardData.getData('text');
        if (!/^\d*\.?\d*$/.test(pastedData)) {
          e.preventDefault(); // Block invalid paste
        }
      };

      const handleSelectSol = (sol: number | null) => {
    setSelectedBuySol(sol);
    setValue(sol ? sol.toString() : '');
  };

  return (
    <div className="bg-[#1E2329] w-80 dark:bg-gray-800 shadow-lg">
      <Sheet open={isOpen} onOpenChange={onClose}>
        {/* <SheetTrigger data-state="open" asChild>
          <Button type='button' ref={ref} className='hidden'>Open</Button>
        </SheetTrigger> */}
        <SheetContent>
          <SheetHeader >
            <h5
              id="drawer-right-label-1"
              className="inline-flex items-center mt-10 mb-1 text-white font-[700] inter-fonts text-[18px] md:text-[25px] dark:text-gray-400"
            >
              Buy Yozoon
            </h5>
            <SheetDescription>
              Purchase Yozoon tokens quickly and easily using SOL.
            </SheetDescription>
          </SheetHeader>

          <div className="border-[2px] border-[#37393E] shadow-lg rounded-[10px] p-2 relative mb-2 mt-10">
            <div className="flex items-center justify-between">
              <input
                type="number"
                value={value}
                onChange={handleInput}
                onPaste={handlePaste}
                // value={quantity}
                // onChange={handleQuantityChange}
                className="flex-1 w-full text-xl p-2 bg-inherit rounded-[5px] text-white border-none focus:outline-none"
                placeholder="0"
              />
              <div className="flex items-center content-center gap-2">
                <img src="/assets/icons/solana.png" className="w-5 h-5" />
                <span className="text-xl">SOL</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 my-5">
            <img
              className="w-4 h-4 text-gray-400"
              src="/assets/wallet_icons/wallet-svg.svg"
            />
            <span className="text-sm text-gray-400">{solBalance} SOL</span>
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <button
              onClick={() => handleSelectSol(null)}
              className="px-4 py-2 text-base font-bold bg-inherit text-gray-400 border-2 border-transparent hover:border-2 hover:border-solid hover:border-[#F6E05E] transition-all duration-200"
            >
              Reset
            </button>
            {solOptions.map((sol) => (
              <button
                key={sol}
                onClick={() => handleSelectSol(sol)}
                className="px-4 py-2 bg-gray-900 text-base w-full font-bold border-2 border-transparent hover:border-2 hover:border-solid hover:border-[#F6E05E] transition-all duration-100"
              >
                {sol}
              </button>
            ))}
          </div>
          <div className="border-t-2  border-[#37393E] shadow-lg rounded-[5px] p-2 relative my-5">
            <div className="flex w-full text-xs items-center justify-between bg-inherit">
              <span className="font-[800] text-lg">You Receive</span>
              <div>
                {/* //add logic to calculate tokens to receive based on selected SOL */}
                <span>15</span>
                <span className="ml-2 text-xs">YOZN</span>
              </div>
            </div>
            <div className="mb-4">
              
              
            </div>
            <div className='mt-10 px-5'>

            <button className="bg-[#FFB92D] w-full rounded-[10px] px-5 py-2 text-[#000000] inter-fonts font-[700] text-[14px] mb-4">
              Buy Yozoon
            </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default BuyYozoon;
