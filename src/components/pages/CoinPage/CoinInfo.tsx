//Page of selected coin showing all deatails(market cap, chart, replies etc)
import React, { useState, useEffect, ChangeEvent } from 'react';
import { PrismaClient } from '@prisma/client';

import OtherTokensCarousel from '../../ui/OtherHotTokensCarousel';
import Spinner from '../../common/Spinner'; // Ensure correct import
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CoinReplies from '@/components/ui/CoinReplies';

import { useAgentRoomStore } from '@/store/agentRoomStore';
import { CoinbaseWalletAdapter } from '@solana/wallet-adapter-wallets';
import CoinVote from './CoinVote';
import PriceChart from './PriceChart';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
//   TimeScale,
// } from 'chart.js';
// import 'chartjs-adapter-date-fns';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
//   TimeScale
// );

 interface CandlestickData {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

const prisma = new PrismaClient();

const CoinInfo = ({ coinData }: { coinData: any }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const agentRoomId = useAgentRoomStore((state) => state.agentRoomId); // Get the agent room ID from the store and use in iframe
  const [solBalance, setSolBalance] = useState(100); // Example balance, should fetch real balance from wallet
  const [agentTokenPrice, setAgentTokenPrice] = useState(0.05); // AI-agent token price in SOL
  const [agentTokenBalance, setAgentTokenBalance] = useState(0); // AI-agent token balance in wallet
  const [selectedBuySol, setSelectedBuySol] = React.useState<number | null>(null);
  const [selectedSellPercentage, setSelectedSellPercentage] =
    React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [modalType, setModalType] = React.useState('success');
  const [value, setValue] = useState('');
  // const [sellValue, setSellValue] = useState('');

  const solOptions = [0.1, 0.5, 1]; // Quantity to buy in SOL [0.1 sol, 0.5 sol, 1 sol]
  const percentageOptions = [25, 50, 75, 100]; // Percentage options for selling [25%, 50%, 75%, 100%]

  const tokensToReceive = selectedBuySol
    ? (selectedBuySol / agentTokenPrice).toFixed(2)
    : '0';
  const tokensToSell = selectedSellPercentage
    ? (selectedSellPercentage / 100) * agentTokenBalance
    : 0;
  const solToReceive = (tokensToSell * agentTokenPrice).toFixed(4);

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

  //!!mock data for price history
//   coinData.priceHistory = [
//   { timestamp: '2024-07-01T00:00:00Z', price: 0.05 },
//   { timestamp: '2024-07-02T00:00:00Z', price: 0.052 },
//   { timestamp: '2024-07-03T00:00:00Z', price: 0.051 },
//   { timestamp: '2024-07-04T00:00:00Z', price: 0.053 },
//   { timestamp: '2024-07-05T00:00:00Z', price: 0.054 },
//   { timestamp: '2024-07-06T00:00:00Z', price: 0.056 },
//   { timestamp: '2024-07-07T00:00:00Z', price: 0.055 },
//   { timestamp: '2024-07-08T00:00:00Z', price: 0.057 },
//   { timestamp: '2024-07-09T00:00:00Z', price: 0.058 },
//   { timestamp: '2024-07-10T00:00:00Z', price: 0.06 },
//   { timestamp: '2024-07-11T00:00:00Z', price: 0.062 },
//   { timestamp: '2024-07-12T00:00:00Z', price: 0.061 },
//   { timestamp: '2024-07-13T00:00:00Z', price: 0.063 },
//   { timestamp: '2024-07-14T00:00:00Z', price: 0.064 },
//   { timestamp: '2024-07-15T00:00:00Z', price: 0.065 },
//   { timestamp: '2024-07-16T00:00:00Z', price: 0.067 },
//   { timestamp: '2024-07-17T00:00:00Z', price: 0.066 },
//   { timestamp: '2024-07-18T00:00:00Z', price: 0.068 },
//   { timestamp: '2024-07-19T00:00:00Z', price: 0.07 },
//   { timestamp: '2024-07-20T00:00:00Z', price: 0.072 },
//   { timestamp: '2024-07-21T00:00:00Z', price: 0.071 },
//   { timestamp: '2024-07-22T00:00:00Z', price: 0.073 },
//   { timestamp: '2024-07-23T00:00:00Z', price: 0.074 },
//   { timestamp: '2024-07-24T00:00:00Z', price: 0.075 },
//   { timestamp: '2024-07-25T00:00:00Z', price: 0.076 },
//   { timestamp: '2024-07-26T00:00:00Z', price: 0.078 },
//   { timestamp: '2024-07-27T00:00:00Z', price: 0.077 },
//   { timestamp: '2024-07-28T00:00:00Z', price: 0.079 },
//   { timestamp: '2024-07-29T00:00:00Z', price: 0.08 },
//   { timestamp: '2024-07-30T00:00:00Z', price: 0.081 },
// ];



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
                          coinData.trendingImage || '/assets/images/solana.png'
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

                  <PriceChart coinId={coinData.id}/>
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
                    src={coinData.trendingImage}
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
                          {/* //add logic to calculate tokens to receive based on selected SOL */}
                          <span>15</span>
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
                              $0.0045
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
                      <button className="bg-[#FFB92D] w-full rounded-[10px] px-5 py-2 text-[#000000] inter-fonts font-[700] text-[14px] mb-4">
                        Buy {coinData.name}
                      </button>
                    </div>
                  </TabsContent>
                  <TabsContent value="Sell">
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

                    <div className="border-t-2  border-[#37393E] shadow-lg rounded-[5px] p-2 grid grid-cols-1 gap-4">
                      <div className="flex w-full text-xs items-center justify-between bg-inherit">
                        <span className="font-[800] text-sm">You Receive</span>
                        <div>
                          {/* //add logic to calculate SOL to receive based on selected token amount */}
                          <span>3.2</span>
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
                      <tr className="bg-gray-800">
                        <td className="py-4 px-3 sm:px-7 block">
                          9LmaU...0Kp
                          <span className="robboto-fonts font-[400] text-[12px] block text-white">
                            🏦 (bonding curve)
                          </span>
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          94%
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          15.74
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          0x1234...5678
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          +753.64
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          21h
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          $0.0,18615/$
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          0/1
                        </td>
                      </tr>
                      <tr className="bg-gray-700">
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          Raydium Authority...
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          94%
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          15.74
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          0x1234...5678
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          +753.64
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          21h
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          $0.0,18615/$
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          0/1
                        </td>
                      </tr>
                      <tr className="bg-gray-800">
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          Raydium Authority...
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          94%
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          15.74
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          0x1234...5678
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          +753.64
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          21h
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          $0.0,18615/$
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          0/1
                        </td>
                      </tr>
                      <tr className="bg-gray-700">
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          Raydium Authority...
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          94%
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          15.74
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          0x1234...5678
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          +753.64
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          21h
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          $0.0,18615/$
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          0/1
                        </td>
                      </tr>
                      <tr className="bg-gray-800">
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          Raydium Authority...
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          94%
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          15.74
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          0x1234...5678
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          +753.64
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          21h
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          $0.0,18615/$
                        </td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          0/1
                        </td>
                      </tr>
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
                  <button className="bg-[#FFB92D] cursor-pointer inter-fonts font-[700] text-[14px] text-black py-2 px-8 rounded-[10px]">
                    Create Proposal
                  </button>
                </div>
                <div className="bg-[#1E2329] rounded-[10px] shadow-lg p-4">
                  <div className="text-white font-[600] sofia-fonts text-center text-[16px] mb-2">
                    Vote Panel
                  </div>
                  <div className="text-white inter-fonts font-[600] text-[12px] text-center mb-2">
                    Minimum Stake Required: 1,000 Tokens
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* <!-- Proposal Card 1 --> */}
                  <div className="bg-[#1E2329] p-4 rounded-[10px] shadow-lg">
                    <div className="block sm:flex justify-between items-center mb-2">
                      <h2 className="sofia-fonts font-[600] text-[18px] sm:text-[20px] text-white">
                        Increase Staking Rewards
                      </h2>
                      <div className="text-sm text-gray-400 flex items-center">
                        <i className="far fa-clock text-white mr-3"></i>
                        <span className="sofia-fonts font-[500] text-[16px] sm:text-[18px] text-white">
                          Ends 20-3-25
                        </span>
                      </div>
                    </div>
                    <p className="text-[#BABABA] robboto-fonts font-[500] text-[14px] mb-4">
                      Proposal to increase staking rewards from 5% to 7% APY to
                      incentivize long-term holders
                    </p>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="sofia-fonts font-[700] text-white text-[13px]">
                        For: 120,000
                      </span>
                      <span className="sofia-fonts font-[700] text-white text-[13px]">
                        Against: 45,000
                      </span>
                    </div>
                    <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full bg-[#2EBD85]"
                        style={{ width: '82%' }}
                      ></div>
                      <div
                        className="absolute right-0 top-0 h-full bg-[#F6465D]"
                        style={{ width: '18%' }}
                      ></div>
                    </div>
                  </div>
                  {/* <!-- Proposal Card 2 --> */}
                  <div className="bg-[#1E2329] p-4 rounded-[10px] shadow-lg">
                    <div className="block sm:flex justify-between items-center mb-2">
                      <h2 className="sofia-fonts font-[600] text-[18px] sm:text-[20px] text-white">
                        Increase Staking Rewards
                      </h2>
                      <div className="text-sm text-gray-400 flex items-center">
                        <i className="far fa-clock text-white mr-3"></i>
                        <span className="sofia-fonts font-[500] text-[16px] sm:text-[18px] text-white">
                          Ends 20-3-25
                        </span>
                      </div>
                    </div>
                    <p className="text-[#BABABA] robboto-fonts font-[500] text-[14px] mb-4">
                      Proposal to increase staking rewards from 5% to 7% APY to
                      incentivize long-term holders
                    </p>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="sofia-fonts font-[700] text-white text-[13px]">
                        For: 120,000
                      </span>
                      <span className="sofia-fonts font-[700] text-white text-[13px]">
                        Against: 45,000
                      </span>
                    </div>
                    <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full bg-[#2EBD85]"
                        style={{ width: '82%' }}
                      ></div>
                      <div
                        className="absolute right-0 top-0 h-full bg-[#F6465D]"
                        style={{ width: '18%' }}
                      ></div>
                    </div>
                  </div>
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
                      <tr className="bg-gray-800">
                        <td className="py-4 px-3 sm:px-7 block">0.5 ETH</td>
                        <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                          Buy
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* <!-- Twitter Task --> */}
                <div className="bg-[#181A20] border-1 border-[#4B4B4B] p-4 rounded-[10px] block sm:flex items-center justify-between">
                  <div className="flex items-center mb-4 md:mb-0 justify-center">
                    <div className="bg-[#282828] p-3 rounded-full flex items-center justify-center">
                      <i className="fab fa-twitter text-[16px] sm:text-2xl"></i>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-[14px] sm:text-[22px] text-white sofia-fonts font-[600]">
                        Follow us on Twitter to Earn
                      </h2>
                      <p className="text-[12px] sm:text-[14px] text-white inter-fonts font-[400]">
                        Connect with our community
                      </p>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <button className="bg-[#FFB92D] text-black text-[14px] font-[700] py-2 px-4 rounded-[9px]">
                      Follow Now
                    </button>
                    <p className="text-[12px] sofia-fonts font-[400] text-white text-center mt-2">
                      10 Points Reward
                    </p>
                  </div>
                </div>
                {/* <!-- Telegram Task --> */}
                <div className="bg-[#181A20] border-1 border-[#4B4B4B] p-4 rounded-[10px] flex flex-col md:flex-row items-center justify-between">
                  <div className="flex items-center mb-4 md:mb-0 justify-center">
                    <div className="bg-[#282828] p-3 rounded-full flex items-center justify-center">
                      <i className="fab fa-telegram-plane text-[16px] sm:text-2xl"></i>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-[14px] sm:text-[22px] text-white sofia-fonts font-[600]">
                        Join Telegram Group to Earn
                      </h2>
                      <p className="text-[12px] sm:text-[14px] text-white inter-fonts font-[400]">
                        Connect with our community
                      </p>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <button className="bg-[#FFB92D] text-black text-[14px] font-[700] py-2 px-4 rounded-[9px]">
                      Follow Now
                    </button>
                    <p className="text-[12px] sofia-fonts font-[400] text-white text-center mt-2">
                      10 Points Reward
                    </p>
                  </div>
                </div>
              </div>
              {/* <!-- Total Available Rewards --> */}
              <div className="bg-[#181A20] p-3 sm:px-4 sm:py-8 rounded-[10px] mt-4 border-1 border-[#4B4B4B] block sm:flex items-center justify-between">
                <div className="w-full text-center sm:text-left">
                  <h2 className="text-white sofia-fonts font-[600] text-[16px] sm:text-[20px]">
                    Total Available Rewards
                  </h2>
                </div>
                <div className="w-auto py-7 sm:py-0 text-center">
                  <span className="bg-[#282828] p-4 rounded-full">
                    <i className="fas fa-trophy text-[18px]"></i>
                  </span>
                </div>
                <div className="w-full text-center sm:text-end">
                  <p className="text-white sofia-fonts font-[600] text-[16px] sm:text-[22px]">
                    25 Points
                  </p>
                </div>
              </div>
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
