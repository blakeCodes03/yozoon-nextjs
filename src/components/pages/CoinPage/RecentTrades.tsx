"use client";
import React, {useState, useEffect} from 'react';
import { PublicKey } from '@solana/web3.js';
import { connection } from '@/lib/connection';

interface recentTradesProps {
  coinId: string;  
  contractAddress: PublicKey;
  totalSupply?: Number;
}

const RecentTrades : React.FC<recentTradesProps> = ({coinId, contractAddress}) => {
    const [trades, setTrades] = useState<any[]>([]);
  const [tradesLoading, setTradesLoading] = useState<boolean>(false);


     // Helper: fetch recent trades (token transfers) by gathering signatures for top token accounts
  async function fetchRecentTrades(
    mintStr: string,
    maxSignaturesPerAccount = 50
  ) {
    try {
      setTradesLoading(true);
      const mint = new PublicKey(mintStr);
      const largest = await connection.getTokenLargestAccounts(mint);
      const entries = largest?.value?.slice(0, 10) || []; // limit to top 10 accounts to reduce RPC calls

      const seenSigs = new Set<string>();
      const sigs: string[] = [];

      for (const e of entries) {
        try {
          const s = await connection.getSignaturesForAddress(e.address, {
            limit: maxSignaturesPerAccount,
          });
          for (const si of s) {
            if (!seenSigs.has(si.signature)) {
              seenSigs.add(si.signature);
              sigs.push(si.signature);
            }
          }
          // small delay to be gentle on RPC
          await new Promise((r) => setTimeout(r, 100));
        } catch (err) {
          // continue
        }
      }

      // fetch parsed transactions in batches
      const txs: any[] = [];
      for (let i = 0; i < sigs.length && txs.length < 100; i++) {
        const sig = sigs[i];
        try {
          const parsed = await connection.getParsedTransaction(
            sig,
            'confirmed'
          );
          if (!parsed) continue;
          const blockTime = parsed.blockTime || null;
          const instructions =
            (parsed.transaction.message as any).instructions || [];
          // extract token transfer instructions
          for (const instr of instructions) {
            if (
              instr.program === 'spl-token' &&
              instr.parsed?.type === 'transfer'
            ) {
              const info = instr.parsed.info;
              txs.push({
                signature: sig,
                blockTime,
                source: info.source,
                destination: info.destination,
                amount: info.amount,
              });
            }
          }
        } catch (err) {
          // ignore individual failures
        }
        // small throttle
        await new Promise((r) => setTimeout(r, 75));
      }

      // sort by blockTime desc and dedupe by signature
      txs.sort((a, b) => (b.blockTime || 0) - (a.blockTime || 0));
      setTrades(txs.slice(0, 50));
    } catch (err) {
      console.error('fetchRecentTrades error', err);
      setTrades([]);
    } finally {
      setTradesLoading(false);
    }
  }

  // Trigger holders & trades fetch when token mint available
  useEffect(() => {
    const mint =
      typeof contractAddress === 'string'
        ? contractAddress
        : contractAddress?.toBase58();

    if (!mint) return;
    // Run small fetches; in dev/test this will use NEXT_PUBLIC_RPC_URL
    fetchRecentTrades(mint, 40);
  }, [contractAddress]);
  return (
     <div
              id="settingss"
              className="tab-content  text-white"
              role="tabpanel"
            >
              <div className="bg-[#1E2329] rounded-[20px] text-white">
                <div className="block sm:flex justify-between items-center text-center px-3 sm:px-7 py-4">
                  <h2 className="inter-fonts font-[700] text-[18px] sm:text-[24px] text-white">
                    Recent Trades
                  </h2>

                  {/* <div className="flex gap-3 mt-4 sm:mt-0 justify-center">
                    <div className="relative">
                      <button className="bg-[#343434] border-2 border-[#4B4B4B] text-white px-3 sm:px-4 w-[120px] sm:w-[160px] py-2 rounded-[10px] flex items-center justify-between">
                        <span className="inter-fonts font-[700] text-white text-[12px] sm:text-[14px]">
                          Last 7 Days
                        </span>
                        <i className="fas fa-chevron-right text-[12px] sm:text-[14px]"></i>
                      </button>
                      <div
                        id="dropdown1"
                        className="absolute right-0 mt-2 w-full bg-gray-700 text-white rounded-md shadow-lg hidden"
                      >
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-600"
                        >
                          Option 1
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-600"
                        >
                          Option 2
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-600"
                        >
                          Option 3
                        </a>
                      </div>
                    </div>
                    <div className="relative">
                      <button className="bg-[#343434] border-2 border-[#4B4B4B] text-white px-3 sm:px-4 w-[120px] sm:w-[160px] py-2 rounded-[10px] flex items-center justify-between">
                        <span className="inter-fonts font-[700] text-white text-[12px] sm:text-[14px]">
                          Buy Only
                        </span>
                        <i className="fas fa-chevron-right text-[12px] sm:text-[14px]"></i>
                      </button>
                      <div
                        id="dropdown2"
                        className="absolute right-0 mt-2 w-full bg-gray-700 text-white rounded-md shadow-lg hidden"
                      >
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-600"
                        >
                          Option 1
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-600"
                        >
                          Option 2
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-600"
                        >
                          Option 3
                        </a>
                      </div>
                    </div>
                  </div> */}
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-gray-800 whitespace-nowrap crollbar-hide">
                    <thead>
                      <tr className="bg-[#000000] text-white">
                        <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
                          Amount
                        </th>
                        <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
                          Type
                        </th>
                        {/* <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
                          Price
                        </th> */}
                        <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
                          Wallet Address
                        </th>
                        <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                        {tradesLoading ? (
                        <tr className="bg-gray-800">
                          <td colSpan={5} className="py-6 text-center">
                            Loading trades...
                          </td>
                        </tr>
                      ) : trades && trades.length > 0 ? (
                        trades.map((t, idx) => (
                          <tr
                            key={t.signature}
                            className={idx % 2 ? 'bg-gray-700' : 'bg-gray-800'}
                          >
                            <td className="py-4 px-3 sm:px-7 block">
                              {t.amount}
                            </td>
                            <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                              Transfer
                            </td>
                            <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                              -
                            </td>
                            <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                              {t.source?.slice?.(0, 6) || ''}...
                              {t.source?.slice?.(-4) || ''}
                            </td>
                            <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                              {t.blockTime
                                ? new Date(t.blockTime * 1000).toLocaleString()
                                : '-'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="bg-gray-800">
                          <td colSpan={5} className="py-6 text-center">
                            No recent trades found
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

export default RecentTrades