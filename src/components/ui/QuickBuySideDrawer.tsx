import React from 'react';
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
  title?: string;
  description?: string;
  
}
type ButtonProps = React.ComponentPropsWithoutRef<'button'>
const QuickBuySideDrawer = React.forwardRef<HTMLButtonElement, QuickBuySideDrawerProps>((props, ref) => {
  return (
    <div className='bg-[#1E2329] w-80 dark:bg-gray-800 shadow-lg'>      
      <Sheet>
        <SheetTrigger data-state="open" asChild>
          <Button type='button' ref={ref} className='hidden'>Open</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <h5
              id="drawer-right-label-1"
              className="inline-flex items-center mb-4 text-white font-[700] inter-fonts text-[18px] md:text-[25px] dark:text-gray-400"
            >
              Quick Buy
            </h5>
            <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="border-[2px] border-[#FFFFFF] rounded-[10px] p-2 relative mb-5">
              <label
                htmlFor="number"
                className="block text-sm font-medium text-white inter-fonts md:font-[700] dark:text-white text-[14px] sm:text-[18px]"
              >
                You Buy
              </label>
              <input
                type="text"
                id="text"
                className="focus:outline-none bg-transparent text-white text-sm block w-full p-2"
                placeholder="0"
              />
              <img
                className="w-[30px] h-auto absolute right-3 top-5"
                src="./images/bitcoin-imag.svg"
                alt=""
              />
            </div>
            <div>
              <span className="bg-[#42474E] rounded-[5px] px-5 py-2 text-white inter-fonts font-[400] text-[14px]">
                0.01
              </span>
              <span className="bg-[#42474E] rounded-[5px] px-5 py-2 text-white inter-fonts font-[400] text-[14px]">
                0.01
              </span>
              <span className="bg-[#42474E] rounded-[5px] px-5 py-2 text-white inter-fonts font-[400] text-[14px]">
                0.5
              </span>
              <span className="bg-[#42474E] rounded-[5px] px-5 py-2 text-white inter-fonts font-[400] text-[14px]">
                1
              </span>
            </div>
            <div className="flex justify-between mt-7">
              <p className="text-[#6E6E6E] inter-fonts font-[400] tex-[14px] sm:text-[18px]">
                ≈$0(0SOL)
              </p>
              <p className="text-[#6E6E6E] inter-fonts font-[400] tex-[14px] sm:text-[18px]">
                Bal:--Bit
              </p>
            </div>
            <div className="border-[2px] border-[#FFFFFF] rounded-[10px] p-2 relative mb-5 mt-5">
              <div className="flex items-center justify-between">
                <div className=" font-medium text-white inter-fonts md:font-[700] dark:text-white text-[14px] sm:text-[18px]">
                  TP
                  <p className="text-[#909090] inter-fonts font-[400] text-[14px] sm:text-[16px]">
                    Please enter the take profit ratio{' '}
                  </p>
                </div>
                <p className="text-[#909090] inter-fonts font-[400] text-[14px] sm:text-[16px]">
                  %
                </p>
              </div>
            </div>
            <p className="text-[#6E6E6E] inter-fonts font-[400] tex-[14px] sm:text-[18px]">
              Estimated Profit --
            </p>
            <div className="flex items-center gap-5 mt-5">
              <p className="text-white inter-fonts font-[400] text-[14px] sm:text-[18px]">
                Trailing Take Profit
              </p>
              <img src="./images/q-mark.png" alt="" />
              <div id="toggleSwitch" className="toggle on">
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" />
                  <div
                    className="text-start relative w-8 h-4.5 bg-[#1E2329] peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-[#FFB92D] dark:peer-focus:ring-[#FFB92D] ring-1 ring-[#FFB92D] rounded-full peer dark:bg-transparent peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-[#FFB92D] after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all dark:border-gray-600 peer-checked:bg-[#1E2329] dark:peer-checked:bg-[#1E2329] 
                                    peer-checked:after:bg-[#FFB92D]"
                  ></div>
                </label>
              </div>
            </div>
            <div className="border-[2px] border-[#FFFFFF] rounded-[10px] p-2 relative mb-5 mt-5">
              <div className="flex items-center justify-between">
                <div className=" font-medium text-white inter-fonts md:font-[700] dark:text-white text-[14px] sm:text-[18px]">
                  SL
                  <p className="text-[#909090] inter-fonts font-[400] text-[14px] sm:text-[16px]">
                    Please enter the take profit ratio{' '}
                  </p>
                </div>
                <p className="text-[#909090] inter-fonts font-[400] text-[14px] sm:text-[16px]">
                  %
                </p>
              </div>
            </div>
            <p className="text-[#6E6E6E] inter-fonts font-[400] tex-[14px] sm:text-[18px]">
              Estimated Loss --
            </p>
            <div className="flex items-center gap-5 mt-5">
              <p className="text-white inter-fonts font-[400] text-[14px] sm:text-[18px]">
                Trailing Stop Loss
              </p>
              <img src="./images/q-mark.png" alt="" />
              <div id="toggleSwitch" className="toggle on">
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" />
                  <div
                    className="text-start relative w-8 h-4.5 bg-[#1E2329] peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-[#FFB92D] dark:peer-focus:ring-[#FFB92D] ring-1 ring-[#FFB92D] rounded-full peer dark:bg-transparent peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-[#FFB92D] after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all dark:border-gray-600 peer-checked:bg-[#1E2329] dark:peer-checked:bg-[#1E2329] 
                                    peer-checked:after:bg-[#FFB92D]"
                  ></div>
                </label>
              </div>
            </div>
            <p className="inter-fonts text-[#6E6E6E] font-[400] text-[14px] sm:text-[16px] mt-5 pt-5">
              Note: If not set take-profit or stop-loss, a market order will be
              placed immediately. If set any one of them, a strategy order will
              be generated. You can check it on the trading page-{' '}
              <Link href="/">[Auto Orders]</Link>.
            </p>
            <div className="text-center mt-5 ">
              <button className="inter-fonts w-[50%] text-black bg-white px-5 py-2 font-[700] rounded-[10px]">
                Save
              </button>
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
});

export default QuickBuySideDrawer;
