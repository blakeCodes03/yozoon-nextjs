//Page of selected coin showing all deatails(market cap, chart, replies etc)
import { useRouter } from 'next/router';
import React, { useState, useEffect, ChangeEvent, useMemo } from 'react';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
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
import { claimAirdrop } from '@/services/token-mill/services/claimAirdrop';
import TopHolders from './TopHolders';
import RecentTrades from './RecentTrades';
import InviteFriendModal from '../ProfilePage/InviteFriendModal';

// Define the CoinData type based on mockMemecoins
type CoinData = {
  id: string; // Unique identifier for the coin
  name: string; // Name of the coin
  keyword: string; // Associated keyword or hashtag
  marketCap: string; // Market capitalization as a string (e.g., "$50k")
  pictureUrl: string; // URL for the coin's image
  totalSupply: Number; // Total supply of the coin as a string
  creator: {
    username: string; // Creator's username
    id?: string; // Optional creator ID (some entries may not have it)
    pictureUrl: string; // URL for the creator's profile picture
  };
  createdAt: string; // ISO timestamp for when the coin was created
  chatMessages: {}[]; // Array of chat messages (empty objects in mock data)
  ticker: string; // Ticker symbol for the coin
  description: string; // Description of the coin
  contractAddress: PublicKey; // Contract address for the coin
  priceHistory?: {
    timestamp: string; // ISO timestamp for the price entry
    price: number; // Price of the coin at the given timestamp
  }[]; // Optional array of price history data
};
interface CandlestickData {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

const CoinInfo = ({ coinData }: { coinData: CoinData }) => {
  const router = useRouter();
  const { id } = router.query; // Retrieve the token ID from the URL
  // const [coinData, setApiCoinData] = useState<CoinData | null>(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const agentRoomId = useAgentRoomStore((state) => state.agentRoomId); // Get the agent room ID from the store and use in iframe
  const [solBalance, setSolBalance] = useState(100); // Example balance, should fetch real balance from wallet
  const [agentTokenPrice, setAgentTokenPrice] = useState(0.05); // AI-agent token price in SOL
  const [agentTokenBalance, setAgentTokenBalance] = useState(1000); // AI-agent token balance in wallet
  const [selectedBuySol, setSelectedBuySol] = React.useState<number | null>(
    null
  );
  const [tokensToReceive, setTokensToReceive] = useState(0);
  const [solToReceive, setSolToReceive] = useState(0);
  const [selectedSellPercentage, setSelectedSellPercentage] = React.useState<
    number | null
  >(null);
  const [solInBondingCurve, setSolInBondingCurve] = useState(0); // Total SOL in bonding curve

  const [showModal, setShowModal] = React.useState(false);
  const [modalType, setModalType] = React.useState('success');
  const [value, setValue] = useState('');

  //invite friend modal state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const [inviteLink, setInviteLink] = useState<string>('');

  const { address, isConnected, caipAddress, embeddedWalletInfo } =
    useAppKitAccount();
  const userTokenMint = new PublicKey(coinData?.contractAddress || '');
  // const userTokenMint = new PublicKey("4r4KKp4ncxFKTM2FQjJvTYBiGCmggaZUp5YCJs4rpVCa");

  const readOnlyProgram = useProgramReadonly();

  const solOptions = [0.1, 0.5, 1]; // Quantity to buy in SOL [0.1 sol, 0.5 sol, 1 sol]
  const percentageOptions = [25, 50, 75, 100]; // Percentage options for selling [25%, 50%, 75%, 100%]
  const { data: session } = useSession(); // Access the session
  const isCreator = session?.user?.id === coinData?.creator?.id; // Check if the user is the creator
  const { walletProvider } = useAppKitProvider<Provider>('solana');

  const program = useProgramUser(walletProvider, isConnected);

  // const tokensToReceive = selectedBuySol
  //   ? (selectedBuySol / agentTokenPrice).toFixed(2)
  //   : '0';
  // const tokensToSell = selectedSellPercentage
  //   ? (selectedSellPercentage / 100) * agentTokenBalance
  //   : 0;

  // const solToReceive = () => {
  //   return (tokensToSell * agentTokenPrice).toFixed(4);
  // };

  async function fetchUserTokenByMint(mintAddress: string) {
    if (!readOnlyProgram) {
      console.error('Program is not initialized');
      return null;
    }

    // Fetch all user-created tokens
    const allTokens = await (readOnlyProgram.account as any).aiAgentToken.all();

    // Find the token with the given mint
    const token = allTokens.find(
      (t: any) => t.account.mint.toBase58() === mintAddress
    );

    if (!token) return null;

    // Format result
    return {
      pubkey: token.publicKey.toBase58(),
      creatorPDA: token.publicKey.toBase58(),
      mint: token.account.mint.toBase58(),
      name: token.account.name,
      symbol: token.account.symbol,
      totalSupply: token.account.totalSupply.toString(),
      kFactor: token.account.bondingCurveParams?.kFactor?.toString(),
      initialPrice: token.account.bondingCurveParams?.initialPrice?.toString(),
      precisionFactor:
        token.account.bondingCurveParams?.precisionFactor?.toString(),
      isMigrated: token.account.isMigrated,
      imageUri: token.account.image || null,
      timeCreated: token.account.creationTimestamp?.toString() || null,
      totalSolRaised: token.account.totalSolRaised?.toString() || '0',
      currentSupply: token.account.currentSupply?.toString() || '0',
    };
  }

  async function fetchTokenBalance(
    userPublicKey: PublicKey,
    tokenMint: PublicKey
  ): Promise<number> {
    try {
      // 1. Derive ATA
      const ata = await getAssociatedTokenAddress(tokenMint, userPublicKey);

      // 2. Fetch token account
      const tokenAccount = await getAccount(connection, ata);

      // 3. Convert balance
      return Number(tokenAccount.amount) / Math.pow(10, 9);
    } catch (err) {
      if (err instanceof TokenAccountNotFoundError) {
        // User does not have an ATA for this token
        return 0;
      }
      console.warn(
        `Error fetching token balance for ${tokenMint.toBase58()}:`,
        err
      );
      return 0;
    }
  }

  // Derived values
  const selectedAmount = useMemo(
    () => selectedBuySol || parseFloat(value) || 0,
    [selectedBuySol, value]
  );

  const getUserTokenPrice = async (
    aiAgentTokenPDA: PublicKey,
    userTokenMint: PublicKey
  ): Promise<number> => {
    if (!program) {
      console.error('Program is not initialized');
      return 0;
    }

    console.log('aiAgentTokenPDA', aiAgentTokenPDA.toBase58());
    console.log('userTokenMint', userTokenMint.toBase58());

    try {
      const price: BN = await program.methods
        .getUserTokenPrice()
        .accounts({
          aiAgentToken: aiAgentTokenPDA,
          mint: userTokenMint,
        })
        .view();

      console.log('Fetched token price:', price.toString());

      return parseFloat(price.toString());
    } catch (err) {
      console.error('Failed to fetch token price:', err);
      return 0;
    }
  };

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

  const updateBondingCurveSol = async () => {
    try {
      const selectedToken = await fetchUserTokenByMint(
        coinData?.contractAddress?.toBase58() || ''
      );
      if (selectedToken) {
        const solRaised =
          Number(selectedToken.totalSolRaised) / LAMPORTS_PER_SOL;
        setSolInBondingCurve(solRaised);
        console.log('✅ Updated SOL in bonding curve:', solRaised);
      }
    } catch (err) {
      console.error('Error updating bonding curve SOL:', err);
    }
  };

  const handleBuy = async () => {
    const { configPDA } = await getConfigPDA();

    if (!program || !isConnected || !address) {
      console.error('Missing required parameters');
      return;
    }

    const pubkey = new PublicKey(address);

    if (!selectedAmount || selectedAmount <= 0) {
      console.error('Invalid buy amount');
      return;
    }

    const MinimumBuyAmount = 0.001; // Minimum buy amount in SOL

    const buyAmount = Math.floor(selectedAmount * LAMPORTS_PER_SOL);

    if (buyAmount > Math.floor(solBalance * LAMPORTS_PER_SOL)) {
      toast.error('Insufficient SOL balance');
      return;
    }

    if (selectedAmount < MinimumBuyAmount) {
      toast.error(`Minimum buy amount is ${MinimumBuyAmount} SOL`);
      return;
    }

    const selectedToken = await fetchUserTokenByMint(
      coinData?.contractAddress?.toBase58() || ''
    );

    if (!selectedToken) {
      console.error('Token not found');
      return;
    }

    const userTokenMint = new PublicKey(selectedToken.mint);
    const tokenOwner = new PublicKey(selectedToken.pubkey);

    const [userStatePDA] = await PublicKey.findProgramAddress(
      [Buffer.from('user_state'), pubkey.toBuffer()],
      program.programId
    );

    console.log('Token Owner:', tokenOwner.toBase58());

    const configAccount = await (program.account as any).config.fetch(
      configPDA
    );

    // Get referrer from URL query param ?ref=<pubkey>
    const referrerAccount = parseReferrer(router.query.ref);
    // const referrerAccount = new PublicKey(
    //   '9kKa2hxJd87oJLQw74umwxoqZABXaLcMCPngkFWBCv7M'
    // ); // Example referrer
    const yozoonTreasury = configAccount.treasury;

    const txSig = await buyUserTokens({
      program,
      userTokenMint: userTokenMint,
      solAmount: buyAmount,
      configPDA: configPDA,
      aiAgentTokenPDA: tokenOwner,
      buyer: pubkey,
      buyerUserStatePDA: userStatePDA,
      platformTreasury: yozoonTreasury,
      referrerAccount: referrerAccount || undefined,
    });

    if (txSig) {
      toast('Purchase successful!');
      await updateBondingCurveSol();
    } else {
      toast('Purchase failed. Please try again.');
    }
  };

  const handleSell = async () => {
    if (selectedAmount > agentTokenBalance) {
      toast.error('Insufficient token balance');
      return;
    }

    const { configPDA } = await getConfigPDA();

    if (!program || !isConnected || !address) {
      console.error('Missing required parameters');
      return;
    }

    const pubkey = new PublicKey(address);

    if (!selectedAmount || selectedAmount <= 0) {
      console.error('Invalid buy amount');
      return;
    }

    const MinimumBuyAmount = 0.001; // Minimum buy amount in SOL

    const selectedToken = await fetchUserTokenByMint(
      coinData?.contractAddress?.toBase58() || ''
    );

    if (!selectedToken) {
      console.error('Token not found');
      return;
    }

    const userTokenMint = new PublicKey(selectedToken.mint);
    const tokenOwner = new PublicKey(selectedToken.pubkey);

    console.log('Token Owner:', tokenOwner.toBase58());

    const configAccount = await (program.account as any).config.fetch(
      configPDA
    );

    const yozoonTreasury = configAccount.treasury;

    await sellUserTokens({
      program,
      userTokenMint: userTokenMint,
      tokenAmount: selectedAmount * Math.pow(10, 9), // assuming 9 decimals`
      configPDA: configPDA,
      aiAgentTokenPDA: tokenOwner,
      seller: pubkey,
      platformTreasury: yozoonTreasury,
    });

    await updateBondingCurveSol();

    toast.success(`Successfully sold `);
  };

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

  // // Use useEffect to set a timeout
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLoading(false); // Change loading state to false after 3 seconds
  //   }, 3000);

  //   // Cleanup the timeout when the component unmounts
  //   return () => clearTimeout(timer);
  // }, []);

  // Fetch SOL balance
  useEffect(() => {
    if (!address || !isConnected) return;

    const pubkey = new PublicKey(address);

    const fetchBalance = async () => {
      try {
        const balance = await connection.getBalance(pubkey);
        const solBalance = balance / LAMPORTS_PER_SOL;
        setSolBalance(Number(solBalance.toFixed(2)));
      } catch (error) {
        console.error('❌ Error fetching balance:', error);
      }
    };

    fetchBalance();

    // Optional: auto-refresh every 30 seconds
    const interval = setInterval(fetchBalance, 30000);

    return () => clearInterval(interval);
  }, [address, isConnected]);

  useEffect(() => {
    const fetchData = async () => {
      const amountSol = selectedAmount || 0; // number
      const amountInLamports = amountSol * LAMPORTS_PER_SOL; // convert SOL to lamports
      const mint = 
  typeof coinData.contractAddress === 'string'
    ? coinData.contractAddress
    : coinData.contractAddress?.toBase58();

      // Fetch user token
      const selectedToken = await fetchUserTokenByMint(
        mint
        // "4r4KKp4ncxFKTM2FQjJvTYBiGCmggaZUp5YCJs4rpVCa"
      );

      if (!selectedToken) {
        console.error('Failed to fetch user token');
        return;
      }

      console.log('selectedToken', selectedToken);

      const aiAgentTokenPDA = new PublicKey(selectedToken.pubkey);
      const userTokenMint = new PublicKey(selectedToken.mint);
      setSolInBondingCurve(selectedToken.totalSolRaised / LAMPORTS_PER_SOL);

      if (!program || !aiAgentTokenPDA || !userTokenMint) {
        console.error('Missing required parameters');
        return;
      }

      console.log('program', program);

      const price = await getUserTokenPrice(aiAgentTokenPDA, userTokenMint);

      setAgentTokenPrice(price);

      const userTokenPrice = price / LAMPORTS_PER_SOL;

      // pricePerTokenSOL = 0.0004
      const pricePerTokenLamports = userTokenPrice * LAMPORTS_PER_SOL; // e.g., 400,000 lamports

      // tokens you get:
      const tokens = amountInLamports / pricePerTokenLamports;

      setTokensToReceive(tokens);

      // solReceived:
      const solReceived = amountSol * userTokenPrice;
      setSolToReceive(solReceived);

      console.log('price', pricePerTokenLamports);
      console.log('tokens to receive:', tokens);
      console.log('SOL received:', solReceived);
    };

    fetchData();
  }, [selectedAmount, value, selectedBuySol, agentTokenBalance, solBalance]);

  useEffect(() => {
    if (!program || !isConnected || !address) return;

    const fetchBalance = async () => {
      try {
        const pubkey = new PublicKey(address);
        const balance = await fetchTokenBalance(pubkey, userTokenMint);

        setAgentTokenBalance(balance);

        console.log('Fetched token balance:', balance);
      } catch (err) {
        console.error('Error fetching token balance:', err);
      }
    };

    fetchBalance();
  }, [program, isConnected, address, agentTokenBalance, agentTokenPrice]);

  //set invite link
  useEffect(() => {
    if (!coinData || !isConnected) return;
    const link = `${window.location.origin}/coins/${coinData.id}?ref=${address}`;
    setInviteLink(link);
  }, [coinData, isConnected, address]);

  //  useEffect(() => {
  //   if (!id) return; // Wait for the token ID to be available

  //   const fetchCoinData = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await axios.get(`/api/coins/${id}`);
  //       setApiCoinData(response.data); // Set the retrieved coin data
  //     } catch (err: any) {
  //       console.error('Error fetching coin data:', err);
  //       setPageError(err.response?.data?.message || 'Failed to fetch coin data');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchCoinData();
  // }, [id]);

  // console.log('coinData', coinData);

  if (pageError) {
    return (
      <div className="text-center flex justify-center items-center h-screen text-red-500">
        Could not load data. Please try again
      </div>
    );
  }

  if (!coinData) {
    return (
      <div className="text-center flex justify-center items-center h-screen">
        No data available for this coin.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
        yup
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
                          coinData?.pictureUrl ||
                          'https://images.unsplash.com/photo-1753097916730-4d32f369bbaa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3NHx8fGVufDB8fHx8fA%3D%3D'
                        }
                        alt={coinData?.name || 'Solana'}
                      />
                    </div>
                    <div className="block sm:flex flex-nowrap items-center gap-2">
                      <h1 className="sofia-fonts font-[700] text-[24px] sm:text-[34px]">
                        {coinData?.name}
                        <span className="font-[500] text-[14px] sm:text-[20px] ml-2">
                          (${coinData?.ticker})
                        </span>
                      </h1>
                      {/* <div>
                        <span
                          className="rounded-full mt-4 font[200] text-[#000000] robboto-fonts font-[400] text-[11px] px-3 py-[3px] leading-none"
                          style={{ background: coinData?.progressBarColor }}
                        >
                          {coinData?.category}
                        </span>
                      </div> */}
                    </div>
                  </div>

                  <h1 className="inter-fonts mt-4 text-[13px] font-[200]">
                    about 2 hours ago
                  </h1>
                  <h1 className="inter-fonts mt-4 text-[13px] font-[400]">
                    <strong>Market cap: </strong>
                    {coinData?.marketCap}
                  </h1>
                  {/* <h1 className="inter-fonts mt-4 text-[13px] font-[400]">
                    <strong>Replies:</strong> {coinData?.replies}
                  </h1> */}
                </div>
                <div></div>
              </div>
            </div>
            <div className="block md:flex flex-row items-center justify-between">
              <div className="block lg:flex items-center gap-8">
                <div className="flex items-center gap-1 mt-2.5">
                  <h1 className="text-[#FFFFFF] font-[500] text-[14px] inter-fonts">
                    {coinData?.name} to
                    <span className="ml-1 text-[#0FC57D] text-[500]">USD:</span>
                  </h1>
                  {/* <h1 className="text-[#FFFFFF] font-[500] text-[14px] inter-fonts">
                    1 {coinData?.name} equals $4.44168 USD
                    <span className="ml-1 text-[#0FC57D] text-[500]">
                      {coinData?.growthPercentage}
                    </span>
                  </h1> */}
                </div>
                <h1 className="mt-3 flex items-center gap-3 text-[#FFFFFF] font-[300] text-[14px] robboto-fonts">
                  {truncateContractAddress(
                    (coinData?.contractAddress).toString()
                  )}{' '}
                  {/* {truncateContractAddress("4r4KKp4ncxFKTM2FQjJvTYBiGCmggaZUp5YCJs4rpVCa")}{' '} */}
                  <span>Agent Controlled Wallet</span>{' '}
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
                {coinData?.priceHistory && coinData?.priceHistory.length > 0 ? (
                  // <Line
                  //   data={getPriceChartData(coinData?.priceHistory)}
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

                  <PriceChart coinId={coinData?.id} />
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
                      coinData?.pictureUrl ||
                      'https://images.unsplash.com/photo-1753097916730-4d32f369bbaa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3NHx8fGVufDB8fHx8fA%3D%3D'
                    }
                    width="40"
                  />
                  <div>
                    <h1 className="text-[14px] sm:text-lg font-[700] sofia-fonts">
                      {coinData?.name} {coinData?.ticker}
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
                    </div>
                    <div className="border-t-2  border-[#37393E] shadow-lg rounded-[5px] p-2 relative">
                      <div className="flex w-full text-xs items-center justify-between bg-inherit">
                        <span className="font-[800] text-sm">You Receive</span>
                        <div>
                          {/* // logic to calculate tokens to receive based on selected SOL */}
                          <span>{tokensToReceive.toFixed(4)}</span>
                          <span className="ml-2 text-xs">
                            {coinData?.ticker}
                          </span>
                        </div>
                      </div>
                      <div className="mb-4">
                        {/* <div className="flex items-center justify-between mb-2">
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
                        </div> */}
                        <div className="bg-[#2B2D32] p-3 rounded-[10px] mt-3">
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
                        onClick={() => handleBuy()}
                        className="bg-[#FFB92D] w-full rounded-[10px] px-5 py-2 text-[#000000] inter-fonts font-[700] text-[14px] mb-4"
                        disabled={
                          !selectedAmount ||
                          selectedAmount <= 0 ||
                          selectedAmount > solBalance ||
                          !isConnected
                        }
                      >
                        Buy {coinData?.name}
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
                          value={value}
                          // onChange={handleQuantityChange}
                          className="flex-1 w-full text-xl p-2 bg-inherit rounded-[5px] text-white border-none focus:outline-none"
                          placeholder="0"
                        />
                        <div className="flex items-center content-center gap-2">
                          <img
                            // src={coinData?.trendingImage || "https://images.unsplash.com/photo-1753097916730-4d32f369bbaa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3NHx8fGVufDB8fHx8fA%3D%3D"}
                            src="https://images.unsplash.com/photo-1753097916730-4d32f369bbaa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3NHx8fGVufDB8fHx8fA%3D%3D"
                            className="w-5 h-5 rounded-sm"
                          />
                          <span className="text-xl">{coinData?.ticker}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 mb-1">
                      <img
                        className="w-4 h-4 text-gray-400"
                        src="/assets/wallet_icons/wallet-svg.svg"
                      />
                      <span className="text-sm text-gray-400">
                        {agentTokenBalance.toFixed(2)} {coinData?.ticker}
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
                          {/* // logic to calculate SOL to receive based on selected token amount */}
                          <span>{solToReceive.toFixed(2)}</span>
                          <span className="ml-2 text-xs">SOL</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSell()}
                        className="bg-[#FFB92D] rounded-[10px] px-5 py-2 text-[#000000] inter-fonts font-[700] text-[14px] mb-4"
                        disabled={!selectedSellPercentage || !isConnected}
                      >
                        Sell {coinData?.name}
                      </button>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mb-4">
                  {/* <div className="flex items-center justify-between mb-1">
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
                  </div> */}
                  <p className="flex items-center inter-fonts font-[400] text-white text-[12px] sm:text-[14px]">
                    There is {solInBondingCurve} SOL in the bonding curve.
                  </p>
                </div>
                {/* <div className="mb-4">
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
                </div> */}
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
                      src={
                        coinData?.pictureUrl || '/assets/images/salona-icon.png'
                      }
                      alt=""
                    />
                  </div>
                  <div className="block sm:flex flex-nowrap items-center gap-2">
                    <h1 className="sofia-fonts font-[700] text-[24px] sm:text-[34px]">
                      {coinData?.name}
                      <span className="font-[500] text-[14px] sm:text-[20px] ml-2">
                        {coinData?.ticker}
                      </span>
                    </h1>
                  </div>
                </div>
                {/* <div className="flex gap-5 items-center mt-5 md:mt-0">
                  {coinData?.socialLinks.telegram && (
                    <a href={coinData?.socialLinks.telegram}>
                      <img
                        className="w-[35px] h-auto"
                        src="/assets/images/contact-telegram.png"
                        alt=" Agent Telegram link"
                      />
                    </a>
                  )}
                  {coinData?.socialLinks.twitter && (
                    <a href={coinData?.socialLinks.twitter}>
                      <img
                        className="w-[35px] h-auto"
                        src="/assets/images/summary-twitter.png"
                        alt="Agent Twitter link"
                      />
                    </a>
                  )}
                  {coinData?.socialLinks.website && (
                    <a href={coinData?.socialLinks.website}>
                      <img
                        className="w-[35px] h-auto"
                        src="/assets/images/summary-cort.png"
                        alt=" Agent Website link"
                      />
                    </a>
                  )}
                </div> */}
              </div>
              <div>
                <h1 className="sofia-fonts font-[500] text-[18px] sm:text-[22px] lg:text-[28px] text-white my-5">
                  {coinData?.name} | The Ultimate High-Speed & Scalable
                  Blockchain for the Future
                </h1>
                <p className="inter-fonts font-[400] text-[14px] text-white leading-7">
                  {coinData?.description}
                  <br />
                  Join the future of blockchain technology with Solana’s
                  cutting-edge capabilities. 🚀
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="Holders">
            {coinData.contractAddress && (
              <TopHolders
                coinId={coinData.id}
                contractAddress={coinData.contractAddress}
                totalSupply={coinData.totalSupply}
              />
            )}
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
                  <CreateProposal coinId={coinData?.id || 'defaultCoinId'} />
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
                  <ActiveProposal coinId={coinData?.id} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="Trades">
            {coinData.contractAddress && (
              <RecentTrades
                coinId={coinData.id}
                contractAddress={coinData.contractAddress}
              />
            )}
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
                    coinId={coinData?.id || '4435rtgfghghghfgfg'}
                    coinTicker={coinData?.ticker || ''}
                    contractAddress={coinData?.contractAddress || ''}
                  />
                </TabsContent>
                <TabsContent value="create-tasks">
                  <CreateTasks coinId={coinData?.id || ''} />
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
      </section>
      {/* <!-- tabs End --> */}
      {/* // Comments Section */}
      <CoinReplies coinId={coinData?.id || ''} />
      {/* // <!-- Vote Section --> */}
      <CoinVote coinId={coinData?.id || ''} />
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
      {/* <div className="border-1 border-[#4B4B4B] p-4 rounded-[10px] my-5">
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
      </div> */}

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
          <div>
            {isInviteModalOpen && (
              <InviteFriendModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                inviteLink={inviteLink}
              />
            )}
            {isConnected && (

            <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="bg-[#FFB92D] inter-fonts font-[700] text-black px-4 py-2 rounded-lg text-[14px]">
              Refer friends
            </button>
            )} 
          </div>
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
