//Page of selected coin showing all deatails(market cap, chart, replies etc)
import React, { useState, useEffect, ChangeEvent } from 'react';
// prisma client should not be instantiated in client components
import { useSession } from 'next-auth/react';
import OtherTokensCarousel from '../../ui/OtherHotTokensCarousel';
import Spinner from '../../common/Spinner'; // Ensure correct import
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CoinReplies from '@/components/ui/CoinReplies';
import CoinVote from './CoinVote';
import PriceChart from './PriceChart';
import CreateProposal from './CreateProposal';
import ActiveProposal from './ActiveProposal';
import CreateTasks from './CreateTasks';
import ActiveTasks from './ActiveTasks';

import { useAgentRoomStore } from '@/store/agentRoomStore';
import { CoinbaseWalletAdapter } from '@solana/wallet-adapter-wallets';
import { buyUserTokens } from '@/services/token-mill/services/buyUserToken';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import * as anchor from '@coral-xyz/anchor';
import { getBondingCurvePDA, getConfigPDA } from '@/utils/config';
import { useProgramUser, useProgramReadonly } from '@/hooks/useProgram';
import type { Provider } from '@reown/appkit-adapter-solana/react';
import { PublicKey, LAMPORTS_PER_SOL, Keypair } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { connection } from '@/lib/connection';
import { toast } from 'sonner';
import {
  getAssociatedTokenAddress,
  getAccount,
  TokenAccountNotFoundError,
} from '@solana/spl-token';
import { sellUserTokens } from '@/services/token-mill/services/sellUserToken';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { claimAirdrop } from '@/services/token-mill/services/claimAirdrop';

interface CandlestickData {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

const CoinInfo = ({ coinData }: { coinData: any }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const agentRoomId = useAgentRoomStore((state) => state.agentRoomId); // Get the agent room ID from the store and use in iframe
  const [solBalance, setSolBalance] = useState(100); // Example balance, should fetch real balance from wallet
  const [agentTokenPrice, setAgentTokenPrice] = useState(0.05); // AI-agent token price in SOL
  const [agentTokenBalance, setAgentTokenBalance] = useState(1000); // AI-agent token balance in wallet
  const [selectedBuySol, setSelectedBuySol] = React.useState<number | null>(
    null
  );
  const [selectedSellPercentage, setSelectedSellPercentage] = React.useState<
    number | null
  >(null);
  const [showModal, setShowModal] = React.useState(false);
  const [modalType, setModalType] = React.useState('success');
  const [value, setValue] = useState('');
  // const [sellValue, setSellValue] = useState('');

  const solOptions = [0.1, 0.5, 1]; // Quantity to buy in SOL [0.1 sol, 0.5 sol, 1 sol]
  const percentageOptions = [25, 50, 75, 100]; // Percentage options for selling [25%, 50%, 75%, 100%]
  const { data: session } = useSession(); // Access the session
  const isCreator = session?.user?.id === coinData?.creator?.id; // Check if the user is the creator

  const tokensToReceive = selectedBuySol
    ? (selectedBuySol / agentTokenPrice).toFixed(2)
    : '0';
  const tokensToSell = selectedSellPercentage
    ? (selectedSellPercentage / 100) * agentTokenBalance
    : 0;

  const solToReceive = () => {
    return (tokensToSell * agentTokenPrice).toFixed(4);
  };

  // Use useEffect to set a timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Change loading state to false after 3 seconds
    }, 3000);

    // Cleanup the timeout when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    //fetch current price of Yozoon token
    // fetch yozoon balance from wallet
  }, []);

  useEffect(() => {
    //implement bonding curve progress logic here for agent token
  }, []);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleSelectPercentage = (percentage: number | null) => {
    setSelectedSellPercentage(percentage);
    // setSellValue(percentage ? percentage.toString() : '');
  };

  const sellValue = selectedSellPercentage
    ? selectedSellPercentage.toString()
    : '';

  const { publicKey, wallet, connected } = useWallet();
  const router = useRouter();
  const program = useProgramUser(wallet, connected);
  const [claiming, setClaiming] = useState(false);
  const [claimTx, setClaimTx] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [buying, setBuying] = useState(false);
  const [buyTx, setBuyTx] = useState<string | null>(null);
  const [buyError, setBuyError] = useState<string | null>(null);

  const [referrerPub, setReferrerPub] = useState<PublicKey | null>(null);
  const [referrerInvalid, setReferrerInvalid] = useState(false);

  // Validate a potential referrer pubkey string
  function parseReferrer(
    queryRef?: string | string[] | undefined
  ): PublicKey | null {
    if (!queryRef) return null;
    const ref = Array.isArray(queryRef) ? queryRef[0] : queryRef;
    if (!ref || typeof ref !== 'string') return null;
    try {
      return new PublicKey(ref);
    } catch (e) {
      return null;
    }
  }

  // Holders & Trades state
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
        entries.map(async (e) => {
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
      const totalSupply = coinData?.totalSupply || null;
      const parsed = detailed.map((d) => {
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
    const mint = coinData?.tokenMint || coinData?.mint;
    if (!mint) return;
    // Run small fetches; in dev/test this will use NEXT_PUBLIC_RPC_URL
    fetchTopHolders(mint, 20);
    fetchRecentTrades(mint, 40);
  }, [coinData?.tokenMint, coinData?.mint]);

  async function handleBuyClick() {
    setBuyError(null);
    setBuyTx(null);
    if (!program) return setBuyError('Connect your wallet');
    if (!publicKey) return setBuyError('Connect your wallet');
    const amountSol = parseFloat(value || '0');
    if (!amountSol || amountSol <= 0) return setBuyError('Enter amount to buy');

    // Determine userTokenMint from coin data (DB-backed tokenMint preferred)
    const mintString = coinData.tokenMint || coinData.mint;
    if (!mintString) return setBuyError('Token mint not available');
    let userTokenMint: PublicKey;
    try {
      userTokenMint = new PublicKey(mintString);
    } catch (e: any) {
      return setBuyError('Invalid token mint');
    }

    // Get referrer from URL query param ?ref=<pubkey>
    const referrerPub = parseReferrer(router.query.ref);

    // Derive config PDA and other PDAs used by buyUserTokens
    try {
      setBuying(true);
      // update referrer state in case router updated since mount
      const refFromUrl = parseReferrer(router.query.ref);
      setReferrerPub(refFromUrl);
      setReferrerInvalid(!!router.query.ref && !refFromUrl);
      // config PDA
      const { configPDA } = await getConfigPDA();
      const configAccount: any = await (program.account as any).config.fetch(
        configPDA
      );
      const tokenOwner = await PublicKey.findProgramAddress(
        [
          Buffer.from('ai_agent_token'),
          publicKey!.toBuffer(),
          userTokenMint.toBuffer(),
        ],
        program.programId
      );

      // buyerUserStatePDA as used by buyUserTokens
      const [buyerUserStatePDA] = await PublicKey.findProgramAddress(
        [Buffer.from('user_state'), publicKey!.toBuffer()],
        program.programId
      );

      const yozoonTreasury = configAccount.treasury;

      // solAmount expected in lamports by the service
      const lamports = Math.floor(amountSol * LAMPORTS_PER_SOL);

      const sig = await buyUserTokens({
        program,
        userTokenMint,
        solAmount: lamports,
        configPDA,
        aiAgentTokenPDA: tokenOwner[0],
        buyer: publicKey!,
        buyerUserStatePDA,
        platformTreasury: yozoonTreasury,
        referrerAccount: referrerPub || undefined,
      });

      setBuyTx(sig);
      toast.success('Purchase sent — tx: ' + sig);
    } catch (err: any) {
      console.error('Buy failed', err);
      setBuyError(err?.message || 'Buy failed');
      toast.error('Buy failed: ' + (err?.message || ''));
    } finally {
      setBuying(false);
    }
  }

  console.log('Selected SOL:', selectedBuySol);
  console.log('Tokens to Receive:', tokensToReceive);
  console.log('Selected Percentage:', selectedSellPercentage);
  console.log('Tokens to Sell:', tokensToSell);
  console.log('SOL to Receive:', solToReceive());

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="max-w-5xl mx-auto">
      <section>
        <div className="container mx-auto px-4 py-2 lg:px-10 xl:px-25">
          <div>
            <button
              onClick={() => window.history.back()}
              className="mt-5 px-10.5 py-[7px] border-1 border-[#FFFFFF] shadow-xs shadow-[#FFFFFF] rounded-full inter-fonts font-[600] text-[#FFFFFF] flex flex-row items-center flex-nowrap text-sm"
            >
              <img
                className="flex-shrink-0 mr-2 w-3 h-3"
                src="/assets/images/back-arrow.svg"
                alt=""
              />
              Back
            </button>
          </div>
          <div className="ml-0 sm:ml-4">
            <div className="flex flex-row justify-between items-center">
              <div className="mt-6 ">
                <div className="text-[#FFFFFF] block lg:flex flex-row items-center gap-5">
                  <div className="block sm:flex items-center gap-2">
                    <div className="solimg flex-shrink-0  w-10 h-10">
                      <img
                        className="w-[100%] h-[100%] object-cover rounded-full"
                        src={
                          coinData.trendingImage ||
                          'https://images.unsplash.com/photo-1753097916730-4d32f369bbaa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3NHx8fGVufDB8fHx8fA%3D%3D'
                        }
                        alt={coinData.name || 'Solana'}
                      />
                    </div>
                    <div className="block sm:flex flex-nowrap items-center gap-2">
                      <h1 className="sofia-fonts font-[700] text-[24px] sm:text-[34px]">
                        {coinData.name}
                        <span className="font-[500] text-[14px] sm:text-[20px] ml-2">
                          (${coinData.symbol})
                        </span>
                      </h1>
                      <div>
                        <span
                          className="rounded-full mt-4 font[200] text-[#000000] robboto-fonts font-[400] text-[11px] px-3 py-[3px] leading-none"
                          style={{ background: coinData.progressBarColor }}
                        >
                          {coinData.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h1 className="inter-fonts mt-4 text-[13px] font-[200]">
                    about 2 hours ago
                  </h1>
                  <h1 className="inter-fonts mt-4 text-[13px] font-[400]">
                    <strong>Market cap: </strong>
                    {coinData.marketCap}
                  </h1>
                  <h1 className="inter-fonts mt-4 text-[13px] font-[400]">
                    <strong>Replies:</strong> {coinData.replies}
                  </h1>
                </div>
                <div></div>
              </div>
            </div>
            <div className="block md:flex flex-row items-center justify-between">
              <div className="block lg:flex items-center gap-8">
                <div className="flex items-center gap-1 mt-2.5">
                  <h1 className="text-[#FFFFFF] font-[500] text-[14px] inter-fonts">
                    {coinData.name} to
                    <span className="ml-1 text-[#0FC57D] text-[500]">USD:</span>
                  </h1>
                  <h1 className="text-[#FFFFFF] font-[500] text-[14px] inter-fonts">
                    1 {coinData.name} equals $4.44168 USD
                    <span className="ml-1 text-[#0FC57D] text-[500]">
                      {coinData.growthPercentage}
                    </span>
                  </h1>
                </div>
                <h1 className="mt-3 flex items-center gap-3 text-[#FFFFFF] font-[300] text-[14px] robboto-fonts">
                  QcdjV...pump <span>Agent Controlled Wallet</span>{' '}
                  <img
                    className="w-3 h-3"
                    src="/assets/images/attechment.svg"
                    alt=""
                  />
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container mx-auto px-4 py-2 lg:px-10 xl:px-25">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* <!-- market stats --> */}
            <div className="lg:col-span-8 border-1 border-[#4B4B4B] rounded-[8px] px-2 py-4">
              <div className="mb-5 pb-3 block sm:flex items-center justify-between">
                <div className="">
                  <h1 className="text-white sofia-fonts font-[700] text-[14px] sm:text-[18px]">
                    Market Overview
                  </h1>
                </div>
              </div>
              {/* Container for interactive charts */}
              <div
                id="chartContainer"
                className="w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[540px]"
              >
                {coinData.priceHistory && coinData.priceHistory.length > 0 ? (
                  // <Line
                  //   data={getPriceChartData(coinData.priceHistory)}
                  //   options={{
                  //     responsive: true,
                  //     plugins: {
                  //       legend: { display: false },
                  //       tooltip: { mode: 'index', intersect: false },
                  //     },
                  //     scales: {
                  //       x: {
                  //         type: 'time',
                  //         time: {
                  //           unit: 'day',
                  //           tooltipFormat: 'MMM d, yyyy HH:mm',
                  //         },
                  //         title: { display: true, text: 'Date' },
                  //         ticks: { color: '#fff' },
                  //       },
                  //       y: {
                  //         title: { display: true, text: 'Price (USD)' },
                  //         ticks: { color: '#fff' },
                  //       },
                  //     },
                  //   }}
                  //   height={400}
                  // />

                  <PriceChart coinId={coinData.id} />
                ) : (
                  <div className="text-white text-center py-10">
                    No price data available.
                  </div>
                )}
              </div>
            </div>

            {/* <!-- second Column (3/12) --> */}
            <div className="lg:col-span-4 border-1 border-[#4B4B4B] rounded-[8px] ">
              <div className="bg-[#181A20] text-white p-4 rounded-lg">
                <div className="flex items-center mb-4">
                  <img
                    alt="Profile picture of a cat wearing a hat"
                    className="w-10 h-10 rounded-full mr-3"
                    height="40"
                    src={
                      coinData.trendingImage ||
                      'https://images.unsplash.com/photo-1753097916730-4d32f369bbaa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3NHx8fGVufDB8fHx8fA%3D%3D'
                    }
                    width="40"
                  />
                  <div>
                    <h1 className="text-[14px] sm:text-lg font-[700] sofia-fonts">
                      {coinData.name} {coinData.driverSymbol}
                    </h1>
                  </div>
                </div>
                <Tabs
                  onValueChange={() => setValue('')}
                  defaultValue="Buy"
                  className="w-full "
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="Buy">Buy</TabsTrigger>
                    <TabsTrigger value="Sell">Sell</TabsTrigger>
                  </TabsList>

                  <TabsContent value="Buy">
                    <div className="border-[2px] border-[#37393E] shadow-lg rounded-[10px] p-2 relative mb-2">
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
                          <img
                            src="/assets/icons/solana.png"
                            className="w-5 h-5"
                          />
                          <span className="text-xl">SOL</span>
                        </div>
                      </div>
                    </div>
                    {/* Referral banner */}
                    {router.query.ref && (
                      <div className="mt-3 mb-3 p-2 rounded text-sm">
                        {referrerInvalid ? (
                          <div className="text-red-400">
                            Provided referrer is invalid and will be ignored.
                          </div>
                        ) : referrerPub ? (
                          <div className="text-green-400">
                            Referrer applied: {referrerPub.toBase58()}
                          </div>
                        ) : (
                          <div className="text-yellow-300">
                            Referrer detected; will be applied if valid.
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-end gap-2 mb-1">
                      <img
                        className="w-4 h-4 text-gray-400"
                        src="/assets/wallet_icons/wallet-svg.svg"
                      />
                      <span className="text-sm text-gray-400">
                        {solBalance} SOL
                      </span>
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
                      {/* Claim Airdrop button - visible when coinData has a mint */}
                    </div>
                    {coinData?.mint && (
                      <div className="mt-4">
                        <button
                          onClick={async () => {
                            setClaimError(null);
                            setClaimTx(null);
                            if (!program)
                              return setClaimError('Connect your wallet');
                            if (!publicKey)
                              return setClaimError('Connect your wallet');
                            setClaiming(true);
                            try {
                              const mintString =
                                coinData.tokenMint || coinData.mint;
                              const mintPub = new PublicKey(mintString);
                              const sig = await claimAirdrop(
                                program,
                                publicKey,
                                { tokenMint: mintPub }
                              );
                              setClaimTx(sig);
                              toast.success('Airdrop claimed — tx: ' + sig);
                            } catch (err: any) {
                              console.error(err);
                              setClaimError(err?.message || 'Claim failed');
                              toast.error(
                                'Claim failed: ' + (err?.message || '')
                              );
                            } finally {
                              setClaiming(false);
                            }
                          }}
                          disabled={!connected || claiming}
                          className="px-4 py-2 bg-green-600 text-white rounded"
                        >
                          {claiming ? 'Claiming...' : 'Claim Airdrop'}
                        </button>

                        {claimTx && (
                          <div className="mt-2 text-xs text-green-400">
                            Tx: {claimTx}
                          </div>
                        )}
                        {claimError && (
                          <div className="mt-2 text-xs text-red-400">
                            {claimError}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="border-t-2  border-[#37393E] shadow-lg rounded-[5px] p-2 relative">
                      <div className="flex w-full text-xs items-center justify-between bg-inherit">
                        <span className="font-[800] text-sm">You Receive</span>
                        <div>
                          {/* //add logic to calculate tokens to receive based on selected SOL */}
                          <span>{tokensToReceive}</span>
                          <span className="ml-2 text-xs">
                            {coinData.ticker}
                          </span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3 my-4">
                            <span className="font-[800] text-white text-sm">
                              Yozoon Fee
                            </span>
                            <i className="fas fa-info-circle text-gray-400"></i>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-10 h-6 bg-gray-300 rounded-full peer-checked:bg-white relative transition-all">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-yellow-400 rounded-full transition-all peer-checked:translate-x-6"></div>
                              </div>
                            </label>
                          </div>
                          <div>
                            <span className="inter-fonts font-[400] text-white text-sm">
                              0.001 YOZOON
                            </span>
                          </div>
                        </div>
                        <div className="bg-[#2B2D32] p-3 rounded-[10px]">
                          <div className="flex items-center justify-between mb-2">
                            <span className="inter-fonts font-[800] text-white text-[14px] sm:text-[16px]">
                              Slippage
                            </span>
                            <span className="inter-fonts font-[700] text-white text-[14px] sm:text-[16px]">
                              5%
                            </span>
                          </div>
                          <p className="inter-fonts font-[400] text-white text-[12px] sm:text-[14px]">
                            We've set a 5% slippage to increase chances of a
                            successful transaction. If the transaction
                            encounters issues, consider increasing the slippage.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleBuyClick}
                        disabled={buying}
                        className="bg-[#FFB92D] w-full rounded-[10px] px-5 py-2 text-[#000000] inter-fonts font-[700] text-[14px] mb-4"
                      >
                        {buying ? 'Buying...' : `Buy ${coinData.name}`}
                      </button>
                    </div>
                  </TabsContent>
                  <TabsContent value="Sell">
                    <div className="border-[2px] border-[#37393E] shadow-lg rounded-[10px] p-2 relative mb-2">
                      <div className="flex items-center justify-between">
                        <input
                          type="number"
                          onChange={handleInput}
                          onPaste={handlePaste}
                          value={tokensToSell}
                          // onChange={handleQuantityChange}
                          className="flex-1 w-full text-xl p-2 bg-inherit rounded-[5px] text-white border-none focus:outline-none"
                          placeholder="0"
                        />
                        <div className="flex items-center content-center gap-2">
                          <img
                            src="https://images.unsplash.com/photo-1753097916730-4d32f369bbaa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3NHx8fGVufDB8fHx8fA%3D%3D"
                            className="w-5 h-5 rounded-sm"
                          />
                          <span className="text-xl">{coinData.ticker}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 mb-1">
                      <img
                        className="w-4 h-4 text-gray-400"
                        src="/assets/wallet_icons/wallet-svg.svg"
                      />
                      <span className="text-sm text-gray-400">
                        7822000.222 {coinData.ticker}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <button
                        onClick={() => handleSelectPercentage(null)}
                        className="px-4 py-2 text-base font-bold bg-inherit text-gray-400 border-2 border-transparent hover:border-2 hover:border-solid hover:border-[#F6E05E] transition-all duration-200"
                      >
                        Reset
                      </button>
                      {percentageOptions.map((sol) => (
                        <button
                          key={sol}
                          onClick={() => handleSelectPercentage(sol)}
                          className="px-4 py-2 bg-gray-900 text-base w-full font-bold border-2 border-transparent hover:border-2 hover:border-solid hover:border-[#F6E05E] transition-all duration-100"
                        >
                          {sol}
                        </button>
                      ))}
                    </div>

                    <div className="border-t-2  border-[#37393E] shadow-lg rounded-[5px] p-2 grid grid-cols-1 gap-4">
                      <div className="flex w-full text-xs items-center justify-between bg-inherit">
                        <span className="font-[800] text-sm">You Receive</span>
                        <div>
                          {/* //add logic to calculate SOL to receive based on selected token amount */}
                          <span>{solToReceive()}</span>
                          <span className="ml-2 text-xs">SOL</span>
                        </div>
                      </div>

                      <button className="bg-[#FFB92D] rounded-[10px] px-5 py-2 text-[#000000] inter-fonts font-[700] text-[14px] mb-4">
                        Sell {coinData.name}
                      </button>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="sofia-fonts font-[400] text-white text-[14px] sm:text-[16px]">
                      Bonding curve progress: 5%
                    </span>
                    <i className="fas fa-info-circle text-white"></i>
                  </div>
                  <div className="bg-[#D9D9D9] h-2 rounded">
                    <div
                      className="bg-[#FFB92D] h-2 rounded"
                      style={{ width: '25%' }}
                    ></div>
                  </div>
                  <p className="inter-fonts font-[400] text-white text-[12px] sm:text-[14px]">
                    there is 0.003 SOL in the bonding curve.
                  </p>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="sofia-fonts font-[400] text-white text-[14px] sm:text-[16px]">
                      king of the hill progress: 0%
                    </span>
                    <i className="fas fa-info-circle text-white"></i>
                  </div>
                  <div className="bg-[#D9D9D9] h-2 rounded">
                    <div
                      className="bg-[#FFB92D] h-2 rounded"
                      style={{ width: '25%' }}
                    ></div>
                  </div>
                  <p className="inter-fonts font-[400] text-white text-[12px] sm:text-[14px]">
                    there is 0.003 SOL in the bonding curve.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="para-sec">
        <div className="container mx-auto px-4 py-2 lg:px-10 xl:px-25">
          <p className="inter-fonts font-[400] text-[14px] text-white border-1 border-[#4B4B4B] p-3 rounded-[10px]">
            Explore newly launched crypto tokens with real-time market insights
            and community discussions. Stay informed with market cap updates,
            project details, and investor replies. Track token performance and
            make informed decisions effortlessly. 🚀
          </p>
        </div>
      </section>

      {/* <!-- tabs start --> */}
      <section className="trending-sec">
        <Tabs defaultValue="Summary" className="w-full ">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="Summary">Summary</TabsTrigger>
            <TabsTrigger value="Holders">Holders</TabsTrigger>
            <TabsTrigger value="DAO">DAO</TabsTrigger>
            <TabsTrigger value="Trades">Trades</TabsTrigger>
            <TabsTrigger value="Earn">Earn</TabsTrigger>
          </TabsList>

          <TabsContent value="Summary">
            <div
              id="dashboard"
              className="tab-content text-white"
              role="tabpanel"
            >
              <div className="text-[#FFFFFF] block sm:flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-10 h-10">
                    <img
                      className="w-[100%] h-[100%] object-cover"
                      src="/assets/images/salona-icon.png"
                      alt=""
                    />
                  </div>
                  <div className="block sm:flex flex-nowrap items-center gap-2">
                    <h1 className="sofia-fonts font-[700] text-[24px] sm:text-[34px]">
                      {coinData.name}
                      <span className="font-[500] text-[14px] sm:text-[20px] ml-2">
                        {coinData.driverSymbol}
                      </span>
                    </h1>
                  </div>
                </div>
                <div className="flex gap-5 items-center mt-5 md:mt-0">
                  <a href="#">
                    <img
                      className="w-[35px] h-auto"
                      src="/assets/images/summary-facebook.png"
                      alt=""
                    />
                  </a>
                  <a href="#">
                    <img
                      className="w-[35px] h-auto"
                      src="/assets/images/summary-twitter.png"
                      alt=""
                    />
                  </a>
                  <a href="#">
                    <img
                      className="w-[35px] h-auto"
                      src="/assets/images/summary-cort.png"
                      alt=""
                    />
                  </a>
                </div>
              </div>
              <div>
                <h1 className="sofia-fonts font-[500] text-[18px] sm:text-[22px] lg:text-[28px] text-white my-5">
                  {coinData.name} | The Ultimate High-Speed & Scalable
                  Blockchain for the Future
                </h1>
                <p className="inter-fonts font-[400] text-[14px] text-white leading-7">
                  {coinData.description}
                  <br />
                  Join the future of blockchain technology with Solana’s
                  cutting-edge capabilities. 🚀
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="Holders">
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
                  <button className="bg-[#515151] robboto-font-[400] mt-4 sm:mt-0 text-[14px] text-white px-4 py-1 rounded-[5px]">
                    Generate bubble map
                  </button>
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
                        <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
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
                        </th>
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
                                {h.address === coinData?.bondingCurveAccount
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
                              {h.address.slice(0, 8)}
                            </td>
                            <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
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
                            </td>
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
          </TabsContent>

          <TabsContent value="DAO">
            <div
              id="settings"
              className="tab-content  text-white"
              role="tabpanel"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                <div className="bg-[#1E2329] rounded-[10px] shadow-lg p-4">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <h3 className="text-sm sofia-fonts sm:text-[16px] font-[600]">
                      Governance Tokens
                    </h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="inter-fonts font-[600] text-sm">2,500</p>
                    <img src="/assets/images/s-small-graph-image.png" alt="" />
                  </div>
                </div>
                <div className="bg-[#1E2329] rounded-[10px] shadow-lg p-4">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <h3 className="text-sm sofia-fonts sm:text-[16px] font-[600]">
                      Staked Tokens
                    </h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="inter-fonts font-[600] text-sm">1,500</p>
                    <img src="/assets/images/s-small-graph-image.png" alt="" />
                  </div>
                </div>
                <div className="bg-[#1E2329] rounded-[10px] shadow-lg p-4 flex items-center justify-center">
                  <CreateProposal coinId={coinData.id} />
                </div>
                <div className="bg-[#1E2329] rounded-[10px] shadow-lg p-4">
                  <div className="text-white font-[600] sofia-fonts text-center text-[16px] mb-2">
                    Vote Panel
                  </div>
                  <div className="text-white inter-fonts font-[600] text-[12px] text-center mb-2">
                    Minimum Stake Required: 1,000 Yozoon Tokens
                  </div>
                  <div className="flex gap-2 item-center justify-center">
                    <button className="bg-[#2EBD85] cursor-pointer text-[12px] inter-fonts text-white font-[700] py-2 px-4 rounded-[10px]">
                      Vote For
                    </button>
                    <button className="bg-[#F6465D] cursor-pointer text-[12px] inter-fonts text-white font-[700] py-2 px-4 rounded-[10px]">
                      Vote Against
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-1 border-[#4B4B4B] rounded-[20px] p-3 sm:p-6 my-5">
                <h1 className="text-center sofia-fonts font-[600] text-[18px] sm:text-[24px] text-white mb-6">
                  Active Proposals
                </h1>
                <div>
                  {/* <!-- Proposal Cards --> */}
                  <ActiveProposal
                    coinId={coinData.id || '4435rtgfghghghfgfg'}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="Trades">
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

                  <div className="flex gap-3 mt-4 sm:mt-0 justify-center">
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
                  </div>
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
                        <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
                          Price
                        </th>
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
                      <tr className="bg-gray-700">
                        <td className="py-4 px-3 sm:px-7 block">0.5 ETH</td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          Sell
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          $2,500
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          0x1234...5678
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          2024-02-13 14:30
                        </td>
                      </tr>
                      <tr className="bg-gray-800">
                        <td className="py-4 px-3 sm:px-7 block">0.5 ETH</td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          Sell
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          $2,500
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          0x1234...5678
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          2024-02-13 14:30
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="Earn">
            <div id="earn" className="tab-content  text-white" role="tabpanel">
              <h1 className="text-center text-xl font-bold mb-6">Earn/Tasks</h1>
              <Tabs defaultValue="Earn" className="w-full ">
                <TabsList
                  className={`grid w-full ${isCreator ? 'grid-cols-2' : 'grid-cols-1'}`}
                >
                  <TabsTrigger value="Earn">Earn</TabsTrigger>
                  {isCreator && (
                    <TabsTrigger value="create-tasks">Create Tasks</TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="Earn">
                  <ActiveTasks
                    coinId={coinData.id || '4435rtgfghghghfgfg'}
                    coinTicker={coinData.ticker}
                  />
                </TabsContent>
                <TabsContent value="create-tasks">
                  <CreateTasks coinId={coinData.id} />
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
      </section>
      {/* <!-- tabs End --> */}
      {/* // Comments Section */}
      <CoinReplies coinId={coinData.id} />
      {/* // <!-- Vote Section --> */}
      <CoinVote coinId={coinData.id} />
      {/* <!-- Stats Section --> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        <div className="bg-[#1E2329] rounded-[10px] shadow-lg p-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h3 className="text-sm sofia-fonts sm:text-[16px] font-[600]">
              Market Cap
            </h3>
            <img
              alt="Price graph"
              className="w-[20px] h-auto"
              src="/assets/images/s-right-arrow.png"
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="inter-fonts font-[600] text-sm">$52,291</p>
            <img src="/assets/images/s-small-graph-image.png" alt="" />
          </div>
        </div>
        <div className="bg-[#1E2329] rounded-[10px] shadow-lg p-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h3 className="text-sm sofia-fonts sm:text-[16px] font-[600]">
              Price
            </h3>
            <img
              alt="Price graph"
              className="w-[20px] h-auto"
              src="/assets/images/s-right-arrow.png"
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="inter-fonts font-[600] text-sm">0.05 SOL</p>
            <img src="/assets/images/s-small-graph-image.png" alt="" />
          </div>
        </div>
        <div className="bg-[#1E2329] rounded-[10px] shadow-lg p-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h3 className="text-sm sofia-fonts sm:text-[16px] font-[600]">
              24H Volume
            </h3>
            <img
              alt="Price graph"
              className="w-[20px] h-auto"
              src="/assets/images/s-right-arrow.png"
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="inter-fonts font-[600] text-sm">$250K</p>
            <img src="/assets/images/s-small-graph-image.png" alt="" />
          </div>
        </div>
        <div className="bg-[#1E2329] rounded-[10px] shadow-lg p-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h3 className="text-sm sofia-fonts sm:text-[16px] font-[600]">
              24H Change
            </h3>
            <img
              alt="Price graph"
              className="w-[20px] h-auto"
              src="/assets/images/s-right-arrow.png"
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="inter-fonts font-[600] text-sm">+15%</p>
            <img src="/assets/images/s-small-graph-image.png" alt="" />
          </div>
        </div>
      </div>

      {/* //chat with agent section */}
      <div className="border-1 border-[#4B4B4B] p-4 rounded-[10px] my-5">
        <h1 className="font-[700] sofia-fonts text-[16px] sm:text-[22px] text-center md:text-[30px] text-white my-4">
          Agent Chat Room
        </h1>
        <div className="bg-[#1E2329] p-3 rounded-[10px] h-[30rem] flex items-center justify-center">
          <iframe
            src="http://173.208.161.187:3000/room/92d2c8b3-acc6-49fc-a5bd-622bfe8f2e3b"
            title="AI Agent Chat"
            width="100%"
            height="100%"
            style={{ border: 'none', borderRadius: '10px', minHeight: '320px' }}
            allow="clipboard-write"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="bg-[#FFB92D]   inter-fonts font-[700] text-black px-4 py-2 rounded-lg flex items-center justify-end gap-3 text-[14px]"
            onClick={() =>
              window.open(
                `http://173.208.161.187:3001/room/${agentRoomId}`,
                '_blank'
              )
            }
          >
            Chat with Agent
            <i className="fas fa-share"></i>
          </button>
        </div>
      </div>

      {/* //refer and earn */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 items-center">
        <div className="col-span-8">
          <h2 className="sofia-fonts font-[700] text-[16px] sm:text-[22px] text-white mb-2">
            Refer Friends. Earn Crypto Together.
          </h2>
          <p className="inter-fonts font-[400] white text-sm leading-7 mb-4">
            Explore newly launched crypto tokens with real-time market insights
            and community discussion. Stay informed with market cap updates,
            project details, and investor replies. Track token performances and
            make informed decisions effortlessly.
          </p>
        </div>
        <div className="col-span-4">
          <img
            alt="Illustration of people discussing crypto with coins floating above them"
            height="150"
            src="/assets/images/coins-image.png"
          />
        </div>
      </div>

      {/* //slider for trending tokens */}
      <div className="border-1 border-[#4B4B4B] rounded-[10px] p-4">
        <h1 className="text-center sofia-fonts font-[700] text-[14px] sm:text-[28px] mb-6">
          Other Hot Tokens
        </h1>
        <OtherTokensCarousel />
      </div>
    </div>
  );
};

export default CoinInfo;
