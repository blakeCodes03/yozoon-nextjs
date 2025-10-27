"use client";

import React, {useState, useEffect} from 'react';
import { PublicKey } from '@solana/web3.js';
import { connection } from '@/lib/connection';


interface topHoldersProps {
  coinId: string;  
  contractAddress: PublicKey;
  totalSupply: Number;
}
const TopHolders: React.FC<topHoldersProps> = ({coinId, contractAddress, totalSupply}) => {
    const [holders, setHolders] = useState<any[]>([]);
  const [holdersLoading, setHoldersLoading] = useState<boolean>(false);
  const [trades, setTrades] = useState<any[]>([]);
  const [tradesLoading, setTradesLoading] = useState<boolean>(false);


  // Helper: fetch top holders using getTokenLargestAccounts (fast)
  async function fetchTopHolders(mintStr: string, limit = 20) {
    try {
      setHoldersLoading(true);
      const mint = new PublicKey(mintStr);
      // returns token account addresses and amounts
      const largest = await connection.getTokenLargestAccounts(mint);
      const entries = largest?.value?.slice(0, limit) || [];

      // fetch parsed account info for each token account to get the owner
      const detailed = await Promise.all(
        entries.map(async (e:any) => {
          try {
            const info = await connection.getParsedAccountInfo(e.address);
            const owner =
              // parsed layout for token account
              (info?.value?.data as any)?.parsed?.info?.owner ||
              (info?.value as any)?.owner?.toBase58?.() ||
              'unknown';
            return {
              address: e.address.toBase58(),
              amountRaw: e.amount, // raw string
              uiAmount: (e as any).uiAmount || null,
              owner,
            };
          } catch (err) {
            return {
              address: e.address.toBase58(),
              amountRaw: e.amount,
              uiAmount: (e as any).uiAmount || null,
              owner: 'unknown',
            };
          }
        })
      );
      // Try to compute percentages using coinData.totalSupply if available
      const coinTotalSupply = totalSupply || null;
      const parsed = detailed.map((d:any) => {
        const amountNum = d.uiAmount
          ? Number(d.uiAmount)
          : Number(d.amountRaw || 0);
        const pct = totalSupply
          ? ((amountNum / Number(totalSupply)) * 100).toFixed(4)
          : null;
        return { ...d, amount: amountNum, pct };
      });

      setHolders(parsed);
    } catch (err) {
      console.error('fetchTopHolders error', err);
      setHolders([]);
    } finally {
      setHoldersLoading(false);
    }
  }

   function truncateContractAddress(
    str: string,
    head = 5,
    tail = 4,
    ellipsis = '...'
  ) {
    if (str.length <= head + tail) {
      return str; // nothing to truncate
    }
    const start = str.slice(0, head);
    const end = str.slice(-tail);
    return start + ellipsis + end; //returns e.g "yfhj3...3d"
  }

  // Trigger holders & trades fetch when token mint available
  useEffect(() => {
    const mint =
      typeof contractAddress === 'string'
        ? contractAddress
        : contractAddress?.toBase58();

    if (!mint) return;
    // Run small fetches; in dev/test this will use NEXT_PUBLIC_RPC_URL
    fetchTopHolders(mint, 20);
  }, [contractAddress]);

  return (
    <div
              id="profile"
              className="tab-content  text-white"
              role="tabpanel"
            >
              <div className="bg-[#1E2329] border-1 border-[#4B4B4B] rounded-[20px] text-white">
                <div className="block sm:flex justify-between items-center text-center px-3 sm:px-7 py-4">
                  <h2 className="inter-fonts font-[700] text-[16px] sm:text-[24px] text-white">
                    Holder Distribution
                  </h2>
                  {/* <button className="bg-[#515151] robboto-font-[400] mt-4 sm:mt-0 text-[14px] text-white px-4 py-1 rounded-[5px]">
                    Generate bubble map
                  </button> */}
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-gray-800 whitespace-nowrap crollbar-hide">
                    <thead>
                      <tr className="bg-[#000000] text-white">
                        <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
                          Holder
                        </th>
                        <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
                          Owned
                        </th>
                        <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
                          SOL\Bal
                        </th>
                        <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
                          Source TF Time
                        </th>
                        {/* <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
                          Inflow Amount
                        </th>
                        <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
                          Holding Duration
                        </th>
                        <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
                          Avg Cost Sold
                        </th>
                        <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
                          Buy\Sell
                        </th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {holdersLoading ? (
                        <tr className="bg-gray-800">
                          <td colSpan={8} className="py-6 text-center">
                            Loading holders...
                          </td>
                        </tr>
                      ) : holders && holders.length > 0 ? (
                        holders.map((h, idx) => (
                          <tr
                            key={h.address}
                            className={idx % 2 ? 'bg-gray-700' : 'bg-gray-800'}
                          >
                            <td className="py-4 px-3 sm:px-7 block">
                              {h.owner?.slice?.(0, 6) || 'unknown'}...
                              {h.owner?.slice?.(-4) || ''}
                              <span className="robboto-fonts font-[400] text-[12px] block text-white">
                                {h.address === contractAddress
                                  ? '🏦 (bonding curve)'
                                  : ''}
                              </span>
                            </td>
                            <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                              {h.pct ? `${h.pct}%` : h.amount}
                            </td>
                            <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                              {h.amount}
                            </td>
                            <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                              {/* {h.address.slice(0, 8)} */}
                              {truncateContractAddress(h.address, 5, 4)}
                            </td>
                            {/* <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                              -
                            </td>
                            <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                              -
                            </td>
                            <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                              -
                            </td>
                            <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                              -
                            </td> */}
                          </tr>
                        ))
                      ) : (
                        <tr className="bg-gray-800">
                          <td colSpan={8} className="py-6 text-center">
                            No holders found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
  )
}

export default TopHolders