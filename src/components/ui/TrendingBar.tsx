// src/components/ui/TrendingBar.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

const mockData = [
  {
    id: '1',
    name: 'Bitcoin',
    ticker: 'BTC',
    pictureUrl: '/assets/images/trending-images/trending-coin.png',
    marketCap: '$5k',
    repliesCount: 120,
  },
  {
    id: '2',
    name: 'Ethereum',
    ticker: 'ETH',
    pictureUrl: '/assets/images/trending-images/trending-coin2.png',
    marketCap: '$20k',
    repliesCount: 80,
  },
  {
    id: '3',
    name: 'Solana',
    ticker: 'SOL',
    pictureUrl: '/assets/images/trending-images/trending-coin3.png',
    marketCap: '$50k',
    repliesCount: 40,
  },
  {
    id: '4',
    name: 'Cardano',
    ticker: 'ADA',
    pictureUrl: '/assets/images/Zilliqa2.png',
    marketCap: '$4k',
    repliesCount: 30,
  },
];

// Split the data evenly between two groups
const firstGroup = mockData.slice(0, Math.ceil(mockData.length / 2));
const secondGroup = mockData.slice(Math.ceil(mockData.length / 2));

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const TrendingBar: React.FC = () => {
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current index for display

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % firstGroup.length); // Cycle through the items
    }, 1700); // Change item every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

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
      <div className="hidden md:grid grid-row md:grid-cols-2 gap-4 md:gap-3">
        {/* First Group */}
        
          <div className="animate-blink inter-fonts flex items-center justify-between gap-2 bg-[#4882DF] px-5 py-2 lg:py-2.5 rounded-md ">
            {/* <!-- Icon --> */}
            <div className=" animate-blink">
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src={firstGroup[currentIndex].pictureUrl}
                  alt={`${firstGroup[currentIndex].name} Logo`}
                />
                
              </Avatar>
            </div>
            {/* <!-- First text element --> */}
            <div className="animate-blinktwo">
              <h1
                className="md:text-[12px] lg:text-[12px] xl:text-[14px] font-bold text-[#000000] md:pr-1.5 lg:pr-1 xl:pr-1.5 border-r-2 border-black animate-text"
                // style="animation-delay: 0s"
                style={{ animationDelay: '0s' }}
              >
                {firstGroup[currentIndex].name}
              </h1>
            </div>
            {/* <!-- Second text element --> */}
            <div className="animate-blinktwo">
              <h1
                className="md:text-[12px] lg:text-[12px] xl:text-[14px] font-bold text-[#000000] md:pr-1.5 lg:pr-1 xl:pr-1.5 border-r-2 border-black animate-text"
                // style="animation-delay: 2s"
                style={{ animationDelay: '2s' }}
              >
               market cap: {firstGroup[currentIndex].marketCap}
              </h1>
            </div>
            {/* <!-- Third text element --> */}
            <div className="animate-blinktwo">
              <h1
                className="md:text-[12px] lg:text-[12px] xl:text-[14px] font-bold text-[#000000] md:pr-1.5 lg:pr-1 xl:pr-1.5  animate-text"
                // style="animation-delay: 4s"
                style={{ animationDelay: '4s' }}
              >
                replies: {firstGroup[currentIndex].repliesCount}
              </h1>
            </div>
          </div>
        
        {/* Second Group */}
        
          <div className="animate-blink inter-fonts flex items-center justify-between gap-2 bg-[#72D7D6] px-2.5 py-2 lg:py-2.5 rounded-md">
            {/* <!-- Icon --> */}
            <div className=" animate-blink">
              <Avatar className="w-6 h-6 object-fit">
                <AvatarImage src={secondGroup[currentIndex].pictureUrl}
              alt={`${secondGroup[currentIndex].name} Logo`} />
                
              </Avatar>
            </div>
            {/* <!-- First text element --> */}
            <div className="animate-blinktwo">
              <h1
                className="md:text-[12px] lg:text-[12px] xl:text-[14px] font-bold text-[#000000] md:pr-1.5 lg:pr-1 xl:pr-1.5 border-r-2 border-black animate-text"
                // style="animation-delay: 0s"
                style={{ animationDelay: '0s' }}
              >
                {secondGroup[currentIndex].name}
              </h1>
            </div>
            {/* <!-- Second text element --> */}
            <div className="animate-blinktwo">
              <h1
                className="md:text-[12px] lg:text-[12px] xl:text-[14px] font-bold text-[#000000] md:pr-1.5 lg:pr-1 xl:pr-1.5 border-r-2 border-black animate-text"
                // style="animation-delay: 2s"
                style={{ animationDelay: '2s' }}
              >
                market cap: {secondGroup[currentIndex].marketCap}
              </h1>
            </div>
            {/* <!-- Third text element --> */}
            <div className="animate-blinktwo">
              <h1
                className="md:text-[12px] lg:text-[12px] xl:text-[14px] font-bold text-[#000000] md:pr-1.5 lg:pr-1 xl:pr-1.5  animate-text"
                // style="animation-delay: 4s"
                style={{ animationDelay: '4s' }}
              >
                replies: {secondGroup[currentIndex].repliesCount}
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
