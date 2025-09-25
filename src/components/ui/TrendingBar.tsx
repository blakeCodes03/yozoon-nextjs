// src/components/ui/TrendingBar.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';

interface TrendingCoin {
  id: string;
  name: string;
  ticker: string;
  logoUrl: string;
  createdAt: string;
  voteCount: number;
  status: 'voting' | 'bondingCurve';
  percentageChange: number;
  style: string;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const TrendingBar: React.FC = () => {
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // useEffect(() => {
  //   const fetchTrendingCoins = async () => {
  //     try {
  //       const response = await axios.get('/api/coins/trending');
  //       setTrendingCoins(response.data);
  //     } catch (error) {
  //       console.error('Error fetching trending coins:', error);
  //       toast.error('Failed to load trending coins.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchTrendingCoins();
  // }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <span className="text-gray-500">Loading Trending...</span>
      </div>
    );
  }

  // if (trendingCoins.length === 0) {
  //   return (
  //     <div className="flex items-center justify-center py-4">
  //       <span className="text-red-500">No trending coins at the moment.</span>
  //     </div>
  //   );
  // }

  return (
    <div>
      {/* <div className="relative w-full py-2 border border-accentBlue rounded-lg overflow-hidden">
      Navigation Arrows//
      <button
        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-bg2 bg-opacity-50 hover:bg-opacity-75 rounded-full p-1 focus:outline-none z-10"
        aria-label="Scroll Left"
      >
        <FaArrowLeft />
      </button>
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-bg2 bg-opacity-50 hover:bg-opacity-75 rounded-full p-1 focus:outline-none z-10"
        aria-label="Scroll Right"
      >
        <FaArrowRight />
      </button>

      Marquee Container//
      <div className="whitespace-nowrap animate-marquee">
        Duplicate the content for seamless scrolling//
        {[...trendingCoins, ...trendingCoins].map((coin, index) => (
          <Link
            href={`/coin/${coin.id}`}
            key={`${coin.id}-${index}`}
            className="inline-flex items-center space-x-4 px-4 py-2 hover:bg-bg2 rounded transition-colors"
          >
            <span className="text-white font-semibold">{`#${formatNumber(coin.voteCount)}`}</span>
            <Image
              src={coin.logoUrl}
              alt={`${coin.name} Logo`}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-white font-semibold">{coin.ticker}</span>
            <span
              className={`text-sm ${
                coin.percentageChange >= 0 ? 'text-green-500' : 'text-red-500'
              } flex items-center`}
            >
              {coin.percentageChange >= 0 ? '▲' : '▼'}
              {Math.abs(coin.percentageChange)}%
            </span>
            <span className="text-sm text-white">🌱</span>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(coin.createdAt), { addSuffix: true })}
            </span>
            <span className="text-sm text-white">
              {coin.status === 'voting' ? '🗳️' : '🔄'}
            </span>
          </Link>
        ))}
      </div>

      CSS Animation //
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div> */}

      <div className="hidden md:grid grid-row md:grid-cols-2 gap-4 md:gap-3">
        <div className="animate-blink inter-fonts flex items-center justify-between gap-2 bg-[#4882DF] px-2.5 py-2 lg:py-2.5 rounded-md ">
          {/* <!-- Icon --> */}
          <div className="w-[30px] h-[30px] animate-blink">
            <img
              className="w-full h-full object-cover"
              src="/assets/images/bit-coin.svg"
              alt="Bitcoin"
            />
          </div>
          {/* <!-- First text element --> */}
          <div className="animate-blinktwo">
            <h1
              className="md:text-[12px] lg:text-[12px] xl:text-[14px] font-bold text-[#000000] md:pr-1.5 lg:pr-1 xl:pr-1.5 border-r-2 border-black animate-text"
              // style="animation-delay: 0s"
              style={{ animationDelay: '0s' }}
            >
              name sold 0.04460 SOL of OK
            </h1>
          </div>
          {/* <!-- Second text element --> */}
          <div className="animate-blinktwo">
            <h1
              className="md:text-[12px] lg:text-[12px] xl:text-[14px] font-bold text-[#000000] md:pr-1.5 lg:pr-1 xl:pr-1.5 border-r-2 border-black animate-text"
              // style="animation-delay: 2s"
              style={{ animationDelay: '2s' }}
            >
              market cap: $19.09k
            </h1>
          </div>
          {/* <!-- Third text element --> */}
          <div className="animate-blinktwo">
            <h1
              className="md:text-[12px] lg:text-[12px] xl:text-[14px] font-bold text-[#000000] md:pr-1.5 lg:pr-1 xl:pr-1.5  animate-text"
              // style="animation-delay: 4s"
              style={{ animationDelay: '4s' }}
            >
              repiles: 119
            </h1>
          </div>
        </div>
        <div className="animate-blink inter-fonts flex items-center justify-between gap-2 bg-[#72D7D6] px-2.5 py-2 lg:py-2.5 rounded-md">
          {/* <!-- Icon --> */}
          <div className="w-[30px] h-[30px] animate-blink">
            <img
              className="w-full h-full object-cover"
              src="/assets/images/bit-coin.svg"
              alt="Bitcoin"
            />
          </div>
          {/* <!-- First text element --> */}
          <div className="animate-blinktwo">
            <h1
              className="md:text-[12px] lg:text-[12px] xl:text-[14px] font-bold text-[#000000] md:pr-1.5 lg:pr-1 xl:pr-1.5 border-r-2 border-black animate-text"
              // style="animation-delay: 0s"
            >
              name sold 0.04460 SOL of OK
            </h1>
          </div>
          {/* <!-- Second text element --> */}
          <div className="animate-blinktwo ">
            <h1
              className="md:text-[12px] lg:text-[12px] xl:text-[14px] font-bold text-[#000000] md:pr-1.5 lg:pr-1 xl:pr-1.5 border-r-2 border-black animate-text"
              style={{ animationDelay: '2s' }}
            >
              market cap: $19.09k
            </h1>
          </div>
          {/* <!-- Third text element --> */}
          <div className="animate-blinktwo">
            <h1
              className="md:text-[12px] lg:text-[12px] xl:text-[14px] font-bold text-[#000000] md:pr-1.5 lg:pr-1 xl:pr-1.5 animate-text"
              // style="animation-delay: 4s"
            >
              repiles: 119
            </h1>
          </div>
        </div>


      </div>
        <div className="flex row items-center justify-center pt-3 md:mt-4.5 gap-3">
          <div className="w-[22px] h-[18px]">
            <a href="">
              <img
                className="w-[100%] h-[100%] object-cover"
                src="/assets/images/social-icons/twitter.svg"
                alt=""
              />
            </a>
          </div>
          <div className="w-[22px] h-[18px]">
            <a href="">
              <img
                className="w-[100%] h-[100%] object-cover"
                src="/assets/images/social-icons/feedback.svg"
                alt=""
              />
            </a>
          </div>
          <div className="w-[22px] h-[18px]">
            <a href="">
              <img
                className="w-[100%] h-[100%] object-cover"
                src="/assets/images/social-icons/discard.svg"
                alt=""
              />
            </a>
          </div>
          <div className="w-[22px] h-[18px]">
            <a href="">
              <img
                className="w-[100%] h-[100%] object-cover"
                src="/assets/images/social-icons/youtube.svg"
                alt=""
              />
            </a>
          </div>
        </div>
    </div>
  );
};

export default TrendingBar;
